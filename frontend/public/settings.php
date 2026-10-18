<?php require_once __DIR__ . '/../views/shared/demo_helpers.php'; require_login(); demo_page_start('Settings'); ?>
<section class="sc-page-narrow"><p class="sc-eyebrow">Preferences and account</p><h1>Settings</h1>
<section class="sc-card sc-setting"><h2>Notification settings</h2><p>Mute notifications and manage your alerts.</p><label><input type="checkbox"> Mute notifications</label><button class="sc-btn sc-btn--secondary" type="button">Save settings</button></section>
<section class="sc-card sc-setting"><h2>App appearance</h2><p>Choose a theme from the theme store.</p><button class="sc-btn sc-btn--secondary" type="button" data-theme-toggle>Switch theme</button><a class="sc-btn sc-btn--ghost" href="#theme-store">Browse theme store</a></section>
<section class="sc-card sc-setting"><h2>Profile settings</h2><label><input type="radio" name="visibility" checked> Public account</label><label><input type="radio" name="visibility"> Private account</label><a class="sc-btn sc-btn--secondary" href="edit-profile.php">Edit profile</a><a class="sc-btn sc-btn--ghost" href="#password">Change password</a><a class="sc-btn sc-btn--ghost" href="logout.php">Log out</a></section>
<section class="sc-card sc-setting"><h2>Delete my account</h2><p>Deleting your account cannot be undone.</p><button class="sc-btn sc-btn--secondary" type="button">Delete account</button></section>
<p class="sc-demo-label">Demo data · settings are UI-only.</p></section>
<?php demo_page_end(); ?>
