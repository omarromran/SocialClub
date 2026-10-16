<?php
declare(strict_types=1);

require_once __DIR__ . '/../../backend/middleware/auth.php';
require_once __DIR__ . '/../../backend/config/database.php';

$errors = [];
$username = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? ''));
    $email = trim((string) ($_POST['email'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');
    $confirmPassword = (string) ($_POST['confirm_password'] ?? '');

    if (!csrf_is_valid($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Your form session expired. Please try again.';
    }
    if ($username === '' || $email === '' || $password === '' || $confirmPassword === '') {
        $errors[] = 'All four fields are required.';
    }
    if ($username !== '' && ctype_digit($username[0])) {
        $errors[] = 'Username cannot start with a number.';
    }
    if ($email !== '' && strpos($email, '@') === false) {
        $errors[] = 'Email must contain an @ symbol.';
    }
    if ($password !== $confirmPassword) {
        $errors[] = 'Passwords do not match.';
    }

    if (!$errors) {
        $check = $pdo->prepare('SELECT username, email FROM users WHERE username = :username OR email = :email LIMIT 1');
        $check->execute(['username' => $username, 'email' => $email]);
        $existing = $check->fetch();
        if ($existing) {
            if (strcasecmp($existing['username'], $username) === 0) {
                $errors[] = 'That username is already registered.';
            }
            if (strcasecmp($existing['email'], $email) === 0) {
                $errors[] = 'That email is already registered.';
            }
        }
    }

    if (!$errors) {
        try {
            $insert = $pdo->prepare('INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password_hash)');
            $insert->execute([
                'username' => $username,
                'email' => $email,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            ]);
            header('Location: login.php?registered=1');
            exit;
        } catch (PDOException $exception) {
            if ((string) $exception->getCode() === '23000') {
                $errors[] = 'That username or email is already registered.';
            } else {
                error_log('Signup failed: ' . $exception->getMessage());
                $errors[] = 'The account could not be created right now.';
            }
        }
    }
}

$pageTitle = 'Sign Up';
$layout = 'public';
require_once __DIR__ . '/../views/shared/header.php';
?>
<section class="sc-page-narrow">
    <section class="sc-card">
        <h1>Create an account</h1>
        <?php if ($errors): ?><div class="sc-alert sc-alert--error" role="alert"><ul><?php foreach ($errors as $error): ?><li><?= e($error) ?></li><?php endforeach; ?></ul></div><?php endif; ?>
        <form class="sc-form" method="post" action="signup.php">
            <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
            <label for="username">Username</label>
            <input id="username" name="username" type="text" value="<?= e($username) ?>" autocomplete="username" required>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" value="<?= e($email) ?>" autocomplete="email" required>
            <label for="password">Password</label>
            <input id="password" name="password" type="password" autocomplete="new-password" required>
            <label for="confirm_password">Confirm Password</label>
            <input id="confirm_password" name="confirm_password" type="password" autocomplete="new-password" required>
            <button class="sc-btn sc-btn--primary" type="submit">Sign up</button>
        </form>
        <p>Already have an account? <a href="login.php">Log in</a></p>
    </section>
</section>
<?php require_once __DIR__ . '/../views/shared/footer.php'; ?>
