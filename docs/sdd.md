# System Design Document — Initial Version

## Architecture

The application uses a simple server-rendered PHP architecture. Requests enter through files in `public/`; PHP includes reusable layout components and accesses MySQL through a PDO connection in `config/`. CSS and JavaScript remain in public assets. SQL scripts and planning documents are kept outside the public application directory.

## Folder responsibilities

```text
public/                 Public entry point and browser-accessible assets
public/assets/css/      Stylesheets
public/assets/js/       JavaScript
public/assets/images/   Image assets (currently empty)
config/                 Database configuration and local connection test
includes/               Shared header and footer
database/               SQL schema and future migrations
docs/                   Proposal, SRS, and design documentation
```

## Initial database design

```text
users (1) ────────────────< (many) posts
  id PK                         id PK
  username UNIQUE               user_id FK -> users.id
  email UNIQUE                  content
  password_hash                 image_path
  ...                           video_path
                                link_url
                                created_at / updated_at
```

Each post belongs to exactly one user through `posts.user_id`. A user may create zero or many posts. The foreign key enforces this relationship, while cascading deletion removes a user's posts when that user is removed. Passwords are represented by `password_hash` and will be populated with a secure password-hashing function in the authentication phase.

## Later database roadmap

Add tables for follows/friend requests, comments, likes, shares, privacy settings, messages/conversations, notifications, media metadata, reports/moderation actions, roles, feature controls, and engagement metrics. Each addition should include indexes, foreign keys, validation rules, and migration documentation.
