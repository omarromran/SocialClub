<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';

$error = '';
$identifier = '';
$registered = isset($_GET['registered']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $identifier = trim((string) ($_POST['identifier'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');
    if (!csrf_is_valid($_POST['csrf_token'] ?? null)) {
        $error = 'Your form session expired. Please try again.';
    } elseif ($identifier === '' || $password === '') {
        $error = 'Username/email and password are required.';
    } else {
        $query = $pdo->prepare('SELECT id, password_hash FROM users WHERE username = :username OR email = :email LIMIT 1');
        $query->execute(['username' => $identifier, 'email' => $identifier]);
        $user = $query->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            $error = 'Incorrect username/email or password.';
        } else {
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int) $user['id'];
            header('Location: profile.php');
            exit;
        }
    }
}

$pageTitle = 'Log In';
$layout = 'public';
require_once __DIR__ . '/../includes/header.php';
?>
<section class="sc-page-narrow">
    <section class="sc-card">
        <h1>Log in</h1>
        <?php if ($registered): ?><div class="sc-alert sc-alert--success" role="status">Account created. You can now log in.</div><?php endif; ?>
        <?php if ($error): ?><div class="sc-alert sc-alert--error" role="alert"><?= e($error) ?></div><?php endif; ?>
        <form class="sc-form" method="post" action="login.php">
            <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
            <label for="identifier">Username / Email</label>
            <input id="identifier" name="identifier" type="text" value="<?= e($identifier) ?>" autocomplete="username" required>
            <label for="password">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required>
            <button class="sc-btn sc-btn--primary" type="submit">Log in</button>
        </form>
        <p>Need an account? <a href="signup.php">Sign up</a></p>
    </section>
</section>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
