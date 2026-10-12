<?php
declare(strict_types=1);

$pageTitle = $pageTitle ?? 'Social Media Website';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<header class="site-header">
    <div class="container header-inner">
        <a class="brand" href="index.php">Social Media Website</a>
        <nav aria-label="Main navigation">
            <a href="index.php">Home</a>
            <a href="signup.php">Sign Up</a>
            <a href="login.php">Login</a>
        </nav>
    </div>
</header>
