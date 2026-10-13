<?php require_once __DIR__ . '/../includes/demo_helpers.php'; require_login(); demo_page_start('People'); ?>
<section class="sc-page-narrow"><p class="sc-eyebrow">Discover</p><h1>People to follow</h1><?php foreach ([$demoUsers[2],$demoUsers[3]] as $person): ?><article class="sc-card sc-person"><div><strong><?= e($person['name']) ?></strong><span>@<?= e($person['username']) ?></span></div><button class="sc-btn sc-btn--secondary" type="button">Follow</button></article><?php endforeach; ?><p class="sc-demo-label">Demo data · follow actions are UI-only.</p></section>
<?php demo_page_end(); ?>
