<?php
declare(strict_types=1);

require_once __DIR__ . '/head.php';
require_once __DIR__ . '/static_data.php';
$demoIsAdmin = $demoIsAdmin ?? false;
$layout = $layout ?? 'public';
$appPrefix = str_contains((string) ($_SERVER['SCRIPT_NAME'] ?? ''), '/admin/') ? '../' : '';
?>
<body class="sc-body--<?= htmlspecialchars($layout, ENT_QUOTES, 'UTF-8') ?>">
<div class="sc-app">
<?php if ($layout === 'app'): ?>
<header class="sc-topbar"><div class="sc-topbar__inner">
    <a class="sc-brand" href="index.php">The Social Club</a>
    <button class="sc-theme-toggle" type="button" data-theme-toggle aria-label="Use dark theme"><span class="sc-theme-icon" aria-hidden="true">◐</span></button>
</div></header>
<div class="sc-layout">
<?php $navMode = 'sidebar'; require __DIR__ . '/nav.php'; ?>
<main class="sc-main" id="main-content">
<?php else: ?>
<header class="sc-public-header"><a class="sc-brand" href="index.php">The Social Club</a><button class="sc-theme-toggle" type="button" data-theme-toggle aria-label="Use dark theme"><span class="sc-theme-icon" aria-hidden="true">◐</span></button></header>
<main class="sc-public-main" id="main-content">
<?php endif; ?>
