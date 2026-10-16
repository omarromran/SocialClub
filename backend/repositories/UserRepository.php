<?php
declare(strict_types=1);

final class UserRepository
{
    public function __construct(private PDO $pdo) {}

    public function findForLogin(string $identifier): ?array
    {
        $query = $this->pdo->prepare('SELECT id, password_hash FROM users WHERE username = :username OR email = :email LIMIT 1');
        $query->execute(['username' => $identifier, 'email' => $identifier]);
        return $query->fetch() ?: null;
    }

    public function findById(int $id): ?array
    {
        $query = $this->pdo->prepare('SELECT username FROM users WHERE id = :id LIMIT 1');
        $query->execute(['id' => $id]);
        return $query->fetch() ?: null;
    }
}
