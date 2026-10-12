<?php if (($layout ?? 'public') === 'app'): ?>
        </main></div>
        <nav class="sc-mobile-tabs" aria-label="Mobile application navigation"><a href="index.php">Home</a><a href="profile.php">Profile</a><a href="login.php">Discover</a><a href="profile.php">Activity</a></nav>
<?php else: ?>
        </main>
<?php endif; ?>
        <footer class="sc-footer"><p>&copy; <?= date('Y') ?> The Social Club</p></footer>
    </div>
<script src="assets/js/theme.js"></script>
</body>
</html>
