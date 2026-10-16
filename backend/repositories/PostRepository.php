<?php
declare(strict_types=1);

final class PostRepository
{
    public function __construct(private PDO $pdo) {}

    public function all(): array
    {
        return $this->pdo->query('SELECT posts.id, posts.user_id, posts.content, posts.created_at, users.username FROM posts INNER JOIN users ON users.id = posts.user_id ORDER BY posts.created_at DESC, posts.id DESC')->fetchAll();
    }

    public function byUser(int $userId): array
    {
        $query = $this->pdo->prepare('SELECT id, content, created_at FROM posts WHERE user_id = :user_id ORDER BY created_at DESC, id DESC');
        $query->execute(['user_id' => $userId]);
        return $query->fetchAll();
    }
}
