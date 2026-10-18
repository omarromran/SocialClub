<?php
declare(strict_types=1);
$navMode = $navMode ?? 'top';
$appPrefix = $appPrefix ?? '';
$demoIsAdmin = $demoIsAdmin ?? false;
?>
<?php if ($navMode === 'sidebar'): ?>
<aside class="sc-sidebar"><nav class="sc-app-tabs" aria-label="Application navigation">
    <a class="sc-app-tab" href="<?= $appPrefix ?>home.php"><span class="sc-app-tab__icon">⌂</span><span>Home</span></a>
    <a class="sc-app-tab" href="<?= $appPrefix ?>messages.php"><span class="sc-app-tab__icon">✉</span><span>Direct messages</span></a>
    <a class="sc-app-tab" href="<?= $appPrefix ?>post-new-media.php"><span class="sc-app-tab__icon">＋</span><span>Add post</span></a>
    <a class="sc-app-tab" href="<?= $appPrefix ?>notifications.php"><span class="sc-app-tab__icon">♡</span><span>Notifications</span></a>
    <a class="sc-app-tab" href="<?= $appPrefix ?>profile.php"><span class="sc-app-tab__icon">◎</span><span>Profile</span></a>
</nav></aside>
<?php else: ?><nav class="sc-nav" aria-label="Main navigation">
    <a href="<?= $appPrefix ?>home.php">Home</a><a href="<?= $appPrefix ?>messages.php">Direct messages</a><a href="<?= $appPrefix ?>post-new-media.php">Add post</a><a href="<?= $appPrefix ?>notifications.php">Notifications</a><a href="<?= $appPrefix ?>profile.php">Profile</a>
</nav><?php endif; ?>
