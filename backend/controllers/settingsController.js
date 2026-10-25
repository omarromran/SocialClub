const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { deleteProfilePictureObject, getPreviousObjectKey } = require('../services/profilePictureService');

async function updatePrivacy(req, res) {
  if (typeof req.body.isPrivate !== 'boolean') return res.status(400).json({ error: 'Choose whether your account should be private.' });
  const user = await prisma.user.update({
    where: { id: BigInt(req.user.id) },
    data: { isPrivate: req.body.isPrivate },
    select: { isPrivate: true },
  });
  res.json({ is_private: user.isPrivate });
}

async function submitFeedback(req, res) {
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Write a message before sending feedback.' });
  if (message.length > 2000) return res.status(400).json({ error: 'Feedback must be 2,000 characters or fewer.' });
  await prisma.feedback.create({ data: { userId: BigInt(req.user.id), message } });
  res.status(201).json({ message: 'Thanks for sharing your feedback.' });
}

async function deleteAccount(req, res) {
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (!password) return res.status(400).json({ error: 'Enter your password to delete your account.' });

  const userId = BigInt(req.user.id);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true, profilePhotoUrl: true } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(400).json({ error: 'Password is incorrect.' });

  const profilePictureKey = getPreviousObjectKey(user.profilePhotoUrl, req.user.id);
  await prisma.user.delete({ where: { id: userId } });
  res.clearCookie('session');
  if (profilePictureKey) {
    try { await deleteProfilePictureObject(profilePictureKey); }
    catch (error) { console.error('Deleted-account profile-picture cleanup failed:', error.message); }
  }
  res.status(204).end();
}

module.exports = { updatePrivacy, submitFeedback, deleteAccount };
