<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_login();
require_once __DIR__ . '/../config/database.php';

$query = $pdo->prepare('SELECT username FROM users WHERE id = :id LIMIT 1');
$query->execute(['id' => (int) $_SESSION['user_id']]);
$user = $query->fetch();
if (!$user) {
    $_SESSION = [];
    session_destroy();
    header('Location: login.php');
    exit;
}

$pageTitle = 'My Profile';
$layout = 'app';
require_once __DIR__ . '/../includes/header.php';
?>
<section class="sc-page-narrow">
    <section class="sc-card">
        <p class="sc-eyebrow">My profile</p>
        <h1>@<?= e($user['username']) ?></h1>
        <div class="sc-profile__stats" aria-label="Profile statistics">
            <div class="sc-stat"><strong>0</strong><span>Posts</span></div>
            <div class="sc-stat"><strong>0</strong><span>Followers</span></div>
            <div class="sc-stat"><strong>0</strong><span>Following</span></div>
        </div>
        <a class="sc-btn sc-btn--secondary" href="logout.php">Log out</a>
    </section>
</section>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
