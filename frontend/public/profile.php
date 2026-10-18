<?php
declare(strict_types=1);

require_once __DIR__ . '/../../backend/middleware/auth.php';
require_login();
require_once __DIR__ . '/../../backend/config/database.php';

$query = $pdo->prepare('SELECT username FROM users WHERE id = :id LIMIT 1');
$query->execute(['id' => (int) $_SESSION['user_id']]);
$user = $query->fetch();
if (!$user) {
    $_SESSION = [];
    session_destroy();
    header('Location: login.php');
    exit;
}

$postsQuery = $pdo->prepare('SELECT id, content, created_at FROM posts WHERE user_id = :user_id ORDER BY created_at DESC, id DESC');
$postsQuery->execute(['user_id' => (int) $_SESSION['user_id']]);
$posts = $postsQuery->fetchAll();

$pageTitle = 'My Profile';
$layout = 'app';
require_once __DIR__ . '/../views/shared/header.php';
?>
<section class="sc-page-narrow">
    <section class="sc-card">
        <p class="sc-eyebrow">My profile</p>
        <h1>@<?= e($user['username']) ?></h1>
        <div class="sc-profile__stats" aria-label="Profile statistics">
            <div class="sc-stat"><strong><?= count($posts) ?></strong><span>Posts</span></div>
            <div class="sc-stat"><strong>0</strong><span>Followers</span></div>
            <div class="sc-stat"><strong>0</strong><span>Following</span></div>
        </div>
        <div class="sc-post__actions"><a class="sc-btn sc-btn--secondary" href="edit-profile.php">Edit profile</a><a class="sc-btn sc-btn--ghost" href="#share-profile">Share profile</a><a class="sc-settings-icon" href="settings.php" aria-label="Open settings" title="Settings">⚙</a></div>
        <p class="sc-demo-label">Share link or QR code will be available here.</p>
    </section>
    <section class="sc-post-list" aria-labelledby="my-posts-title">
        <h2 id="my-posts-title">My posts</h2>
        <?php if (!$posts): ?><div class="sc-card sc-empty"><p>You have not shared anything yet.</p></div><?php endif; ?>
        <?php foreach ($posts as $post): ?>
            <article class="sc-card sc-post">
                <header class="sc-post__header"><strong>@<?= e($user['username']) ?></strong><time datetime="<?= e($post['created_at']) ?>"><?= e(date('M j, Y g:i A', strtotime($post['created_at']))) ?></time></header>
                <p class="sc-post__content"><?= nl2br(e($post['content'])) ?></p>
                <form method="post" action="home.php"><input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>"><input type="hidden" name="delete_post_id" value="<?= (int) $post['id'] ?>"><button class="sc-btn sc-btn--ghost sc-btn--delete" type="submit">Delete</button></form>
            </article>
        <?php endforeach; ?>
    </section>
</section>
<?php require_once __DIR__ . '/../views/shared/footer.php'; ?>
