# Frontend

- `public/` is the web server document root and contains only public entry points and assets.
- `views/shared/` contains reusable layout and presentation helpers.

Keep database access and business rules in `../backend`; pages should only coordinate a request and render a view.
