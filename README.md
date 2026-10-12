# Social Media Website

Phase 1 provides a beginner-friendly XAMPP/PHP foundation. It contains a placeholder home page, reusable layout components, PDO configuration, an initial users/posts schema, and planning documentation. Social functionality is intentionally not implemented yet.

## Prerequisites

- XAMPP with Apache, PHP, and MySQL/MariaDB
- A browser
- PHP with the PDO MySQL extension enabled

## Run with XAMPP

1. Copy the project into XAMPP's `htdocs` directory, for example `C:\xampp\htdocs\socialclub`.
2. Start Apache and MySQL from the XAMPP Control Panel.
3. Import `database/schema.sql` in phpMyAdmin, or run it in the MySQL console.
4. Adjust credentials in `config/database.php` if your local MySQL setup differs from the default XAMPP `root` account.
5. Open `http://localhost/socialclub/public/`.

For a cleaner local URL, configure an Apache virtual host whose document root is the project's `public/` directory. Keep `config/`, `includes/`, `database/`, and `docs/` outside the public document root where possible.

## Test the database connection

After configuring the database, visit `http://localhost/socialclub/config/database_test.php` only in local development. It should display `Database connection successful.` Remove or disable this test before deployment. Do not expose database credentials in public files.

## Status and next phase

Completed: Phase 1 setup, shared layout, placeholder page, PDO connection foundation, initial schema, and documentation.

Not implemented: registration, login, profiles, posts, likes, comments, messaging, notifications, administration, and other social features. The next phase should begin with authentication and secure session handling.
