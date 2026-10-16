<?php
declare(strict_types=1);

$pageTitle = 'The Social Club';
$layout = 'public';
require_once __DIR__ . '/../views/shared/header.php';
?>

<section class="sc-public-hero">
    <p class="sc-eyebrow">Welcome to</p>
    <h1>The Social Club</h1>
    <p class="sc-lead">A place to connect, share, and stay close to your community.</p>
    <div class="sc-public-actions"><a class="sc-btn sc-btn--primary" href="signup.php">Sign up</a><a class="sc-btn sc-btn--secondary" href="login.php">Log in</a></div>
</section>

<?php require_once __DIR__ . '/../views/shared/footer.php'; ?>
