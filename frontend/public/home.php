<?php
declare(strict_types=1);

require_once __DIR__ . '/../../backend/middleware/auth.php';
require_login();
require_once __DIR__ . '/../../backend/config/database.php';

$error = '';
$success = isset($_GET['created']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_is_valid($_POST['csrf_token'] ?? null)) {
        $error = 'Your form session expired. Please try again.';
    } elseif (isset($_POST['delete_post_id'])) {
        $postId = filter_var($_POST['delete_post_id'], FILTER_VALIDATE_INT);
        if (!$postId) {
            $error = 'That post could not be found.';
        } else {
            $delete = $pdo->prepare('DELETE FROM posts WHERE id = :id AND user_id = :user_id');
            $delete->execute(['id' => $postId, 'user_id' => (int) $_SESSION['user_id']]);
            if ($delete->rowCount() !== 1) {
                $error = 'You can only delete your own posts.';
            } else {
                header('Location: home.php?deleted=1');
                exit;
            }
        }
    } else {
        $content = trim((string) ($_POST['content'] ?? ''));
        if ($content === '') {
            $error = 'Write something before posting.';
        } else {
            $insert = $pdo->prepare('INSERT INTO posts (user_id, content) VALUES (:user_id, :content)');
            $insert->execute(['user_id' => (int) $_SESSION['user_id'], 'content' => $content]);
            header('Location: home.php?created=1');
            exit;
        }
    }
}

$postsQuery = $pdo->query('SELECT posts.id, posts.user_id, posts.content, posts.created_at, users.username FROM posts INNER JOIN users ON users.id = posts.user_id ORDER BY posts.created_at DESC, posts.id DESC');
$posts = $postsQuery->fetchAll();
$pageTitle = 'Home';
$layout = 'app';
require_once __DIR__ . '/../views/shared/header.php';
?>
<section class="sc-feed">
    <div class="sc-page-heading"><p class="sc-eyebrow">Your feed</p><h1>Home</h1></div>
    <form class="sc-search-bar" method="get" action="search.php" role="search"><input id="home-search" name="q" type="search" aria-label="Search people and posts" placeholder="Search people and posts"><button class="sc-btn sc-btn--secondary" type="submit">Search</button></form>
    <div class="sc-tabs" aria-label="Feed type"><a href="#following">Following</a><a href="#trending">Trending</a></div>
    <?php if ($success || isset($_GET['deleted'])): ?><div class="sc-alert sc-alert--success" role="status"><?= $success ? 'Post published.' : 'Post deleted.' ?></div><?php endif; ?>
    <?php if ($error): ?><div class="sc-alert sc-alert--error" role="alert"><?= e($error) ?></div><?php endif; ?>
    <section class="sc-card sc-composer" aria-labelledby="composer-title">
        <h2 id="composer-title">Share an update</h2>
        <form class="sc-form" method="post" action="home.php">
            <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
            <label for="content">What would you like to share?</label>
            <textarea id="content" name="content" rows="4" required></textarea>
            <button class="sc-btn sc-btn--primary" type="submit">Post</button>
        </form>
    </section>
    <section class="sc-post-list" aria-labelledby="recent-posts-title">
        <h2 id="recent-posts-title">Recent posts</h2>
        <?php if (!$posts): ?><div class="sc-card sc-empty"><p>No posts yet. Be the first to share an update.</p></div><?php endif; ?>
        <?php foreach ($posts as $post): ?>
            <article class="sc-card sc-post">
                <header class="sc-post__header"><strong>@<?= e($post['username']) ?></strong><time datetime="<?= e($post['created_at']) ?>"><?= e(date('M j, Y g:i A', strtotime($post['created_at']))) ?></time></header>
                <p class="sc-post__content"><?= nl2br(e($post['content'])) ?></p>
                <?php if ((int) $post['user_id'] === (int) $_SESSION['user_id']): ?><form method="post" action="home.php"><input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>"><input type="hidden" name="delete_post_id" value="<?= (int) $post['id'] ?>"><button class="sc-btn sc-btn--ghost sc-btn--delete" type="submit">Delete</button></form><?php endif; ?>
            </article>
        <?php endforeach; ?>
    </section>
</section>
<?php require_once __DIR__ . '/../views/shared/footer.php'; ?>
