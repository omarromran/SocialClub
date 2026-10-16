<?php if (($layout ?? 'public') === 'app'): ?>
        </main></div>
        <nav class="sc-mobile-tabs" aria-label="Mobile application navigation">
            <a href="<?= $appPrefix ?? '' ?>home.php">Home</a>
            <a href="<?= $appPrefix ?? '' ?>profile.php">Profile</a>
            <a href="<?= $appPrefix ?? '' ?>people.php">Discover</a>
            <a href="<?= $appPrefix ?? '' ?>messages.php">Messages</a>
            <a href="<?= $appPrefix ?? '' ?>notifications.php">Activity</a>
            <a href="<?= $appPrefix ?? '' ?>search.php">Search</a>
            <a href="<?= $appPrefix ?? '' ?>settings.php">Settings</a>
            <?php if (!empty($demoIsAdmin)): ?><a href="<?= $appPrefix ?? '' ?>admin/index.php">Admin</a><?php endif; ?>
            <a href="<?= $appPrefix ?? '' ?>logout.php">Log out</a>
        </nav>
<?php else: ?>
        </main>
<?php endif; ?>
        <footer class="sc-footer"><p>&copy; <?= date('Y') ?> The Social Club · <a href="<?= $appPrefix ?? '' ?>sitemap.php">Sitemap</a></p></footer>
    </div>
<script src="<?= $assetPrefix ?? '' ?>assets/js/theme.js"></script>
</body>
</html>
