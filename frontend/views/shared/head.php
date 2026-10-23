<?php
declare(strict_types=1);
$pageTitle = $pageTitle ?? 'The Social Club';
$htmlLang = $htmlLang ?? 'en';
$htmlDir = $htmlDir ?? 'ltr';
$assetPrefix = str_contains((string) ($_SERVER['SCRIPT_NAME'] ?? ''), '/admin/') ? '../' : '';
?>
<!doctype html>
<html lang="<?= htmlspecialchars($htmlLang, ENT_QUOTES, 'UTF-8') ?>" dir="<?= htmlspecialchars($htmlDir, ENT_QUOTES, 'UTF-8') ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <script>try{var t=localStorage.getItem('sc-theme');if(['light','dark','ocean'].indexOf(t)!==-1)document.documentElement.dataset.theme=t;}catch(e){}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= $assetPrefix ?>assets/css/tokens.css">
    <link rel="stylesheet" href="<?= $assetPrefix ?>assets/css/base.css">
    <link rel="stylesheet" href="<?= $assetPrefix ?>assets/css/layout.css">
    <link rel="stylesheet" href="<?= $assetPrefix ?>assets/css/components.css">
</head>
