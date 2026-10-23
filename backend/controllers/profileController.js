const prisma = require('../config/prisma');
const {
  uploadProfilePicture,
  deleteProfilePicture,
  deleteProfilePictureObject,
  getPreviousObjectKey,
} = require('../services/profilePictureService');

function publicUser(user) {
  return {
    id: Number(user.id),
    display_name: user.displayName,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profile_photo_url: user.profilePhotoUrl,
    created_at: user.createdAt,
  };
}

async function getProfile(req, res) {
  const userId = BigInt(req.user.id);
  const [user, posts, followers, following] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.post.count({ where: { userId } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);
  res.json({ user: publicUser(user), stats: { posts, followers, following } });
}

async function getFollowers(req, res) {
  const rows = await prisma.follow.findMany({
    where: { followingId: BigInt(req.user.id) },
    orderBy: { follower: { username: 'asc' } },
    select: { follower: { select: { id: true, username: true, profilePhotoUrl: true } } },
  });
  res.json({ users: rows.map(({ follower }) => ({ id: Number(follower.id), username: follower.username, profile_photo_url: follower.profilePhotoUrl })) });
}

async function getFollowing(req, res) {
  const rows = await prisma.follow.findMany({
    where: { followerId: BigInt(req.user.id) },
    orderBy: { following: { username: 'asc' } },
    select: { following: { select: { id: true, username: true, profilePhotoUrl: true } } },
  });
  res.json({ users: rows.map(({ following }) => ({ id: Number(following.id), username: following.username, profile_photo_url: following.profilePhotoUrl })) });
}

async function updateBio(req, res) {
  const bio = typeof req.body.bio === 'string' ? req.body.bio.trim() : '';
  if (bio.length > 160) return res.status(400).json({ error: 'Bio must be 160 characters or fewer.' });
  const user = await prisma.user.update({ where: { id: BigInt(req.user.id) }, data: { bio: bio || null } });
  res.json({ user: publicUser(user) });
}

async function updateProfile(req, res) {
  const userId = BigInt(req.user.id);
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  const displayName = typeof req.body.displayName === 'string' ? req.body.displayName.trim() : existing.displayName || existing.username;
  const username = typeof req.body.username === 'string' ? req.body.username.trim().toLowerCase() : existing.username;
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : existing.email;
  const bio = typeof req.body.bio === 'string' ? req.body.bio.trim() : existing.bio || '';

  if (!displayName || displayName.length > 80) return res.status(400).json({ error: 'Display name is required and must be 80 characters or fewer.' });
  if (!/^[a-z0-9_]{3,30}$/.test(username)) return res.status(400).json({ error: 'Username must be 3-30 lowercase letters, numbers, or underscores.' });
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 255) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (bio.length > 160) return res.status(400).json({ error: 'Bio must be 160 characters or fewer.' });

  const duplicate = await prisma.user.findFirst({
    where: { id: { not: userId }, OR: [{ username }, { email }] },
    select: { username: true, email: true },
  });
  if (duplicate) {
    if (duplicate.username === username) return res.status(409).json({ error: 'That username is already in use.' });
    return res.status(409).json({ error: 'That email address is already in use.' });
  }

  const previousUrl = existing.profilePhotoUrl || null;
  let upload = null;
  try {
    if (req.file) upload = await uploadProfilePicture(req.file, req.user.id);
    const user = await prisma.user.update({
      where: { id: userId },
      data: { displayName, username, email, bio: bio || null, ...(upload ? { profilePhotoUrl: upload.url } : {}) },
    });
    if (upload) {
      const previousKey = getPreviousObjectKey(previousUrl, req.user.id);
      if (previousKey && previousKey !== upload.objectKey) {
        try { await deleteProfilePicture(upload, previousKey); } catch (error) { console.error('Profile-picture cleanup failed:', error.message); }
      }
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    if (upload) {
      try { await deleteProfilePicture(upload, upload.objectKey); } catch (cleanupError) { console.error('New profile-picture cleanup failed:', cleanupError.message); }
    }
    if (error.code === 'P2002') return res.status(409).json({ error: 'That username or email address is already in use.' });
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    throw error;
  }
}

async function removeProfilePicture(req, res) {
  const userId = BigInt(req.user.id);
  const current = await prisma.user.findUnique({ where: { id: userId }, select: { profilePhotoUrl: true } });
  const previousKey = getPreviousObjectKey(current.profilePhotoUrl, req.user.id);
  const user = await prisma.user.update({ where: { id: userId }, data: { profilePhotoUrl: null } });
  if (previousKey) {
    try { await deleteProfilePictureObject(previousKey); } catch (error) { console.error('Profile-picture removal cleanup failed:', error.message); }
  }
  return res.json({ user: publicUser(user) });
}

module.exports = { getProfile, getFollowers, getFollowing, updateBio, updateProfile, removeProfilePicture };
