# Backend

Server-side application code belongs here. Keep browser-facing entry points in `frontend/public` and keep SQL schema/migrations in `database`.

- `config/` — infrastructure configuration such as the PDO connection.
- `controllers/` — request orchestration and redirects; keep HTML out of these files.
- `middleware/` — cross-cutting request checks such as authentication and CSRF helpers.
- `repositories/` — database queries grouped by domain.
- `services/` — business rules that do not belong in a controller or repository.
