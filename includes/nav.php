<?php
declare(strict_types=1);

$navMode = $navMode ?? 'top';
$appPrefix = $appPrefix ?? '';
$demoIsAdmin = $demoIsAdmin ?? false;
?>
<?php if ($navMode === 'sidebar'): ?>
<aside class="sc-sidebar">
    <nav class="sc-app-tabs" aria-label="Application navigation">
        <a class="sc-app-tab" href="<?= $appPrefix ?>home.php"><span class="sc-app-tab__icon" aria-hidden="true">⌂</span><span>Home</span></a>
        <a class="sc-app-tab" href="<?= $appPrefix ?>profile.php"><span class="sc-app-tab__icon" aria-hidden="true">○</span><span>Profile</span></a>
        <a class="sc-app-tab" href="<?= $appPrefix ?>people.php"><span class="sc-app-tab__icon" aria-hidden="true">⌕</span><span>Discover</span></a>
        <a class="sc-app-tab" href="<?= $appPrefix ?>messages.php"><span class="sc-app-tab__icon" aria-hidden="true">✉</span><span>Messages</span></a>
        <a class="sc-app-tab" href="<?= $appPrefix ?>notifications.php"><span class="sc-app-tab__icon" aria-hidden="true">♡</span><span>Activity</span></a>
        <a class="sc-app-tab" href="<?= $appPrefix ?>search.php"><span class="sc-app-tab__icon" aria-hidden="true">⌕</span><span>Search</span></a>
        <a class="sc-app-tab" href="<?= $appPrefix ?>settings.php"><span class="sc-app-tab__icon" aria-hidden="true">⚙</span><span>Settings</span></a>
        <?php if ($demoIsAdmin): ?><a class="sc-app-tab" href="<?= $appPrefix ?>admin/index.php"><span class="sc-app-tab__icon" aria-hidden="true">▦</span><span>Admin</span></a><?php endif; ?>
        <a class="sc-app-tab" href="<?= $appPrefix ?>logout.php"><span class="sc-app-tab__icon" aria-hidden="true">↪</span><span>Log out</span></a>
    </nav>
</aside>
<?php else: ?>
<nav class="sc-nav" aria-label="Main navigation">
    <a href="<?= $appPrefix ?>home.php">Home</a>
    <a href="<?= $appPrefix ?>messages.php">Messages</a>
    <a href="<?= $appPrefix ?>notifications.php">Notifications</a>
    <a href="<?= $appPrefix ?>search.php">Search</a>
    <a href="<?= $appPrefix ?>profile.php">Profile</a>
    <a href="<?= $appPrefix ?>settings.php">Settings</a>
    <a href="<?= $appPrefix ?>logout.php">Log out</a>
    <?php if ($demoIsAdmin): ?><a href="<?= $appPrefix ?>admin/index.php">Admin</a><?php endif; ?>
    <button class="sc-theme-toggle" type="button" data-theme-toggle aria-label="Use dark theme"><span class="sc-theme-icon" aria-hidden="true">◐</span></button>
</nav>
<?php endif; ?>
