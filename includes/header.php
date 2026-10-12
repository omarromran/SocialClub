<?php
declare(strict_types=1);

require_once __DIR__ . '/head.php';
$layout = $layout ?? 'public';
?>
<body class="sc-body--<?= htmlspecialchars($layout, ENT_QUOTES, 'UTF-8') ?>">
<div class="sc-app">
<?php if ($layout === 'app'): ?>
<header class="sc-topbar"><div class="sc-topbar__inner">
    <a class="sc-brand" href="index.php">The Social Club</a>
    <nav class="sc-nav" aria-label="Main navigation">
        <a href="profile.php">Profile</a><a href="logout.php">Log out</a>
        <button class="sc-theme-toggle" type="button" data-theme-toggle aria-label="Use dark theme"><span class="sc-theme-icon" aria-hidden="true">◐</span></button>
    </nav>
</div></header>
<div class="sc-layout">
<aside class="sc-sidebar"><nav class="sc-app-tabs" aria-label="Application navigation">
    <a class="sc-app-tab" href="index.php"><span class="sc-app-tab__icon" aria-hidden="true">⌂</span><span>Home</span></a>
    <a class="sc-app-tab" href="profile.php"><span class="sc-app-tab__icon" aria-hidden="true">○</span><span>Profile</span></a>
    <a class="sc-app-tab" href="login.php"><span class="sc-app-tab__icon" aria-hidden="true">⌕</span><span>Discover</span></a>
    <a class="sc-app-tab" href="profile.php"><span class="sc-app-tab__icon" aria-hidden="true">♡</span><span>Activity</span></a>
</nav></aside>
<main class="sc-main" id="main-content">
<?php else: ?>
<header class="sc-public-header"><a class="sc-brand" href="index.php">The Social Club</a><button class="sc-theme-toggle" type="button" data-theme-toggle aria-label="Use dark theme"><span class="sc-theme-icon" aria-hidden="true">◐</span></button></header>
<main class="sc-public-main" id="main-content">
<?php endif; ?>
