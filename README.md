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
4. Adjust credentials in `backend/config/database.php` if your local MySQL setup differs from the default XAMPP `root` account.
5. Open `http://localhost/socialclub/frontend/public/`, or configure Apache's document root to `frontend/public`.

For a cleaner local URL, configure an Apache virtual host whose document root is the project's `frontend/public` directory. Keep `backend/` and `database/` outside the public document root.

## Test the database connection

After configuring the database, visit `http://localhost/socialclub/backend/config/database_test.php` only in local development. It should display `Database connection successful.` Remove or disable this test before deployment. Do not expose database credentials in public files.

## Status and next phase

Completed: Phase 1 setup, shared layout, placeholder page, PDO connection foundation, initial schema, and documentation.

Phases 4–10 now include UI-only demonstration pages backed by static data in `frontend/views/shared/static_data.php`. They do not add tables, backend queries, or production actions. Real media, likes, comments, relationships, messaging, notifications, search, settings, and admin authorization remain future backend work. The real text-post feed and owner-only deletion remain active.

## UI page map

Authenticated demo pages include media examples, post detail, likes, people, requests, user profiles, followers, following, messages, notifications, search, settings, profile editing, reporting, sitemap, and admin demonstration pages under `frontend/public/admin/`.
