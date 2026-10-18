<?php if (($layout ?? 'public') === 'app'): ?>
        </main></div>
        <nav class="sc-mobile-tabs" aria-label="Mobile application navigation">
            <a href="<?= $appPrefix ?? '' ?>home.php">Home</a>
            <a href="<?= $appPrefix ?? '' ?>messages.php">Messages</a>
            <a href="<?= $appPrefix ?? '' ?>post-new-media.php">Add post</a>
            <a href="<?= $appPrefix ?? '' ?>notifications.php">Notifications</a>
            <a href="<?= $appPrefix ?? '' ?>profile.php">Profile</a>
        </nav>
<?php else: ?>
        </main>
<?php endif; ?>
    </div>
<script src="<?= $assetPrefix ?? '' ?>assets/js/theme.js"></script>
</body>
</html>
