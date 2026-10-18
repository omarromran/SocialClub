USE social_media_db;

-- Development/admin seed. The password is stored as a bcrypt hash, never plaintext.
INSERT INTO users (username, email, password_hash, is_admin)
VALUES ('admin', 'admin@socialclub.local', '$2y$10$vujxfz3rhwGm58jhyrhifeSY10/4UGBZSxuvrZIrtlRXHwSs3q39G', 1)
ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash),
    is_admin = 1;
