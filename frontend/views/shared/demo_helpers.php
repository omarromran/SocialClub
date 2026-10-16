<?php
declare(strict_types=1);
require_once __DIR__ . '/../../../backend/middleware/auth.php';
require_once __DIR__ . '/static_data.php';
function demo_page_start(string $title): void { global $layout; $layout = 'app'; $pageTitle = $title; require __DIR__ . '/header.php'; }
function demo_page_end(): void { require __DIR__ . '/footer.php'; }
function demo_post(array $post, bool $showActions = true): void { ?>
<article class="sc-card sc-post"><header class="sc-post__header"><strong>@<?= e($post['username']) ?></strong><time datetime="<?= e($post['created_at']) ?>"><?= e(date('M j, Y g:i A', strtotime($post['created_at']))) ?></time></header><p class="sc-post__content"><?= nl2br(e($post['content'])) ?></p><?php if ($showActions): ?><div class="sc-post__actions"><a class="sc-btn sc-btn--ghost" href="post.php?id=<?= (int) $post['id'] ?>">View post</a><span><?= (int) $post['likes'] ?> likes · <?= (int) $post['comments'] ?> comments</span></div><?php endif; ?></article>
<?php }
