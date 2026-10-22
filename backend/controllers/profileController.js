const pool = require('../config/database');
const {
  uploadProfilePicture,
  deleteProfilePicture,
  deleteProfilePictureObject,
  getPreviousObjectKey,
} = require('../services/profilePictureService');

async function getProfile(req, res) {
  const userResult = await pool.query('SELECT id, username, email, bio, profile_photo_url, created_at FROM users WHERE id = $1', [req.user.id]);
  const countResult = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM posts WHERE user_id = $1)::int AS posts,
       (SELECT COUNT(*) FROM follows WHERE following_id = $1)::int AS followers,
       (SELECT COUNT(*) FROM follows WHERE follower_id = $1)::int AS following`,
    [req.user.id],
  );
  res.json({ user: userResult.rows[0], stats: countResult.rows[0] });
}

async function getFollowers(req, res) {
  const result = await pool.query(
    `SELECT u.id, u.username, u.profile_photo_url
     FROM follows f
     JOIN users u ON u.id = f.follower_id
     WHERE f.following_id = $1
     ORDER BY u.username ASC`,
    [req.user.id],
  );
  res.json({ users: result.rows });
}

async function getFollowing(req, res) {
  const result = await pool.query(
    `SELECT u.id, u.username, u.profile_photo_url
     FROM follows f
     JOIN users u ON u.id = f.following_id
     WHERE f.follower_id = $1
     ORDER BY u.username ASC`,
    [req.user.id],
  );
  res.json({ users: result.rows });
}

async function updateBio(req, res) {
  const bio = typeof req.body.bio === 'string' ? req.body.bio.trim() : '';
  if (bio.length > 160) return res.status(400).json({ error: 'Bio must be 160 characters or fewer.' });
  const result = await pool.query('UPDATE users SET bio = $1 WHERE id = $2 RETURNING id, username, bio', [bio || null, req.user.id]);
  res.json({ user: result.rows[0] });
}

async function updateProfile(req, res) {
  const bio = typeof req.body.bio === 'string' ? req.body.bio.trim() : '';
  if (bio.length > 160) return res.status(400).json({ error: 'Bio must be 160 characters or fewer.' });

  const current = await pool.query('SELECT profile_photo_url FROM users WHERE id = $1', [req.user.id]);
  const previousUrl = current.rows[0]?.profile_photo_url || null;
  let upload = null;

  try {
    if (req.file) upload = await uploadProfilePicture(req.file, req.user.id);
    const result = await pool.query(
      'UPDATE users SET bio = $1, profile_photo_url = COALESCE($2, profile_photo_url) WHERE id = $3 RETURNING id, username, bio, profile_photo_url',
      [bio || null, upload?.url || null, req.user.id],
    );

    if (upload) {
      const previousKey = getPreviousObjectKey(previousUrl, req.user.id);
      if (previousKey && previousKey !== upload.objectKey) {
        try {
          await deleteProfilePicture(upload, previousKey);
        } catch (error) {
          console.error('Profile-picture cleanup failed:', error.message);
        }
      }
    }
    return res.json({ user: result.rows[0] });
  } catch (error) {
    if (upload) {
      try {
        await deleteProfilePicture(upload, upload.objectKey);
      } catch (cleanupError) {
        console.error('New profile-picture cleanup failed:', cleanupError.message);
      }
    }
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    throw error;
  }
}

async function removeProfilePicture(req, res) {
  const current = await pool.query('SELECT profile_photo_url FROM users WHERE id = $1', [req.user.id]);
  const previousUrl = current.rows[0]?.profile_photo_url || null;
  const previousKey = getPreviousObjectKey(previousUrl, req.user.id);
  const result = await pool.query(
    'UPDATE users SET profile_photo_url = NULL WHERE id = $1 RETURNING id, username, bio, profile_photo_url',
    [req.user.id],
  );

  if (previousKey) {
    try {
      await deleteProfilePictureObject(previousKey);
    } catch (error) {
      console.error('Profile-picture removal cleanup failed:', error.message);
    }
  }

  return res.json({ user: result.rows[0] });
}

module.exports = { getProfile, getFollowers, getFollowing, updateBio, updateProfile, removeProfilePicture };
