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
require_once __DIR__ . '/../includes/header.php';
?>
<main class="container profile-container">
    <section class="card profile-card">
        <p class="eyebrow">My profile</p>
        <h1>@<?= e($user['username']) ?></h1>
        <div class="profile-stats" aria-label="Profile statistics">
            <div><strong>0</strong><span>Posts</span></div>
            <div><strong>0</strong><span>Followers</span></div>
            <div><strong>0</strong><span>Following</span></div>
        </div>
        <a class="button secondary" href="logout.php">Logout</a>
    </section>
</main>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
