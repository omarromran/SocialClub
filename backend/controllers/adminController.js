const prisma = require('../config/prisma');

const features = [
  { id: 'direct-messages', name: 'Direct messages', enabled: true },
  { id: 'image-posts', name: 'Image posts', enabled: true },
  { id: 'public-profiles', name: 'Public profiles', enabled: true },
];
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function parseId(value) {
  try {
    const id = BigInt(value);
    return id > 0n ? id : null;
  } catch {
    return null;
  }
}

function readFeatures() {
  return features;
}

function now() {
  return new Date();
}

function activeSessionWhere(extra = {}) {
  return { revokedAt: null, expiresAt: { gt: now() }, ...extra };
}

async function listUsers(req, res) {
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { displayName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      displayName: true,
      username: true,
      email: true,
      isAdmin: true,
      isSuspended: true,
      passwordChangedAt: true,
      createdAt: true,
      _count: { select: { posts: true, comments: true } },
      sessions: { where: activeSessionWhere(), select: { id: true } },
      admin: { select: { id: true } },
    },
  });

  res.json({
    users: users.map((user) => ({
      id: Number(user.id),
      display_name: user.displayName,
      username: user.username,
      email: user.email,
      is_admin: user.isAdmin || Boolean(user.admin),
      is_suspended: user.isSuspended,
      password_changed_at: user.passwordChangedAt,
      created_at: user.createdAt,
      posts: user._count.posts,
      comments: user._count.comments,
      active_sessions: user.sessions.length,
    })),
  });
}

async function setSuspended(req, res) {
  const userId = parseId(req.params.id);
  if (typeof req.body?.suspended !== 'boolean') return res.status(400).json({ error: 'Suspended must be true or false.' });
  const suspend = req.body.suspended;
  if (!userId) return res.status(400).json({ error: 'Invalid user.' });
  if (userId === BigInt(req.user.id)) return res.status(400).json({ error: 'You cannot suspend your own account.' });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { admin: true } });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  if (user.isAdmin || user.admin) return res.status(400).json({ error: 'Admin accounts cannot be suspended.' });

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { isSuspended: suspend } }),
    ...(suspend
      ? [prisma.session.updateMany({ where: activeSessionWhere({ userId }), data: { revokedAt: now() } })]
      : []),
  ]);

  res.json({ message: suspend ? 'User suspended.' : 'User restored.', is_suspended: suspend });
}

async function deleteUser(req, res) {
  const userId = parseId(req.params.id);
  if (!userId) return res.status(400).json({ error: 'Invalid user.' });
  if (userId === BigInt(req.user.id)) return res.status(400).json({ error: 'You cannot delete your own account.' });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { admin: true } });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  if (user.isAdmin || user.admin) return res.status(400).json({ error: 'Admin accounts cannot be deleted.' });

  await prisma.user.delete({ where: { id: userId } });
  res.json({ message: 'User deleted.' });
}

async function closeUserSessions(req, res) {
  const userId = parseId(req.params.id);
  if (!userId) return res.status(400).json({ error: 'Invalid user.' });

  const result = await prisma.session.updateMany({
    where: activeSessionWhere({
      userId,
      tokenId: { not: req.user.jti },
    }),
    data: { revokedAt: now() },
  });

  res.json({ message: 'Active sessions closed.', closed: result.count });
}

async function closeRecentPasswordChangeSessions(req, res) {
  const since = new Date(Date.now() - THIRTY_DAYS);
  const users = await prisma.user.findMany({
    where: { passwordChangedAt: { gte: since } },
    select: { id: true, username: true },
  });

  const ids = users.map((user) => user.id);
  const result = ids.length
    ? await prisma.session.updateMany({
        where: activeSessionWhere({
          userId: { in: ids },
          tokenId: { not: req.user.jti },
        }),
        data: { revokedAt: now() },
      })
    : { count: 0 };

  res.json({
    message: 'Closed sessions for accounts that changed a password in the last 30 days.',
    users: users.length,
    closed: result.count,
    since,
  });
}

async function listPosts(req, res) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 80,
    include: {
      user: { select: { username: true, displayName: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  res.json({
    posts: posts.map((post) => ({
      id: Number(post.id),
      caption: post.caption || '',
      is_system: post.isSystem,
      created_at: post.createdAt,
      username: post.user.username,
      display_name: post.user.displayName,
      likes: post._count.likes,
      comments: post._count.comments,
    })),
  });
}

async function deletePost(req, res) {
  const postId = parseId(req.params.id);
  if (!postId) return res.status(400).json({ error: 'Invalid post.' });
  try {
    await prisma.post.delete({ where: { id: postId } });
  } catch {
    return res.status(404).json({ error: 'Post not found.' });
  }
  res.json({ message: 'Post removed.' });
}

async function listComments(req, res) {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 80,
    include: {
      user: { select: { username: true } },
      post: { select: { id: true, caption: true } },
    },
  });

  res.json({
    comments: comments.map((comment) => ({
      id: Number(comment.id),
      content: comment.content,
      created_at: comment.createdAt,
      username: comment.user.username,
      post_id: Number(comment.post.id),
      post_caption: comment.post.caption || '',
    })),
  });
}

async function deleteComment(req, res) {
  const commentId = parseId(req.params.id);
  if (!commentId) return res.status(400).json({ error: 'Invalid comment.' });
  try {
    await prisma.comment.delete({ where: { id: commentId } });
  } catch {
    return res.status(404).json({ error: 'Comment not found.' });
  }
  res.json({ message: 'Comment removed.' });
}

async function createSystemPost(req, res) {
  const caption = typeof req.body.caption === 'string' ? req.body.caption.trim() : '';
  if (!caption) return res.status(400).json({ error: 'Write a message for the system post.' });
  if (caption.length > 500) return res.status(400).json({ error: 'Keep the notice to 500 characters or fewer.' });

  const post = await prisma.post.create({
    data: {
      userId: BigInt(req.user.id),
      caption,
      isSystem: true,
    },
  });

  res.status(201).json({
    post: { id: Number(post.id), caption: post.caption, is_system: true, created_at: post.createdAt },
    message: 'System notice posted.',
  });
}

async function listFeatures(req, res) {
  res.json({ features: readFeatures() });
}

async function updateFeature(req, res) {
  const features = readFeatures();
  const feature = features.find((item) => item.id === req.params.id);
  if (!feature) return res.status(404).json({ error: 'Feature not found.' });
  if (typeof req.body?.enabled !== 'boolean') return res.status(400).json({ error: 'Enabled must be true or false.' });
  feature.enabled = req.body.enabled;
  res.json({ feature, message: `${feature.name} ${feature.enabled ? 'enabled' : 'disabled'}.` });
}

async function getTrends(req, res) {
  const [users, posts, comments, likes, shares, topPosts] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.share.count(),
    prisma.post.findMany({
      take: 8,
      orderBy: [{ likes: { _count: 'desc' } }, { comments: { _count: 'desc' } }],
      include: {
        user: { select: { username: true } },
        _count: { select: { likes: true, comments: true, shares: true } },
      },
    }),
  ]);

  res.json({
    totals: { users, posts, comments, likes, shares, engagement: likes + comments + shares },
    popular: topPosts.map((post) => ({
      id: Number(post.id),
      caption: post.caption || '(no caption)',
      username: post.user.username,
      likes: post._count.likes,
      comments: post._count.comments,
      shares: post._count.shares,
      score: post._count.likes + post._count.comments + post._count.shares,
    })),
  });
}

async function bootstrapAdmin() {
  const username = process.env.ADMIN_BOOTSTRAP_USERNAME?.trim().toLowerCase();
  if (!username) return;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return;
  await prisma.user.update({ where: { id: user.id }, data: { isAdmin: true } });
  await prisma.admin.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
}

module.exports = {
  listUsers,
  setSuspended,
  deleteUser,
  closeUserSessions,
  closeRecentPasswordChangeSessions,
  listPosts,
  deletePost,
  listComments,
  deleteComment,
  createSystemPost,
  listFeatures,
  updateFeature,
  getTrends,
  bootstrapAdmin,
};
