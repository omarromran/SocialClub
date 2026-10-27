const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const prisma = require('../config/prisma');

function publicUser(user) {
  return {
    id: Number(user.id),
    display_name: user.displayName,
    username: user.username,
    email: user.email,
    is_admin: Boolean(user.isAdmin || user.admin),
    bio: user.bio,
    profile_photo_url: user.profilePhotoUrl,
    is_private: user.isPrivate,
    created_at: user.createdAt,
  };
}

async function createSession(res, user) {
  const tokenId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = jwt.sign(
    { id: user.id.toString(), username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d', jwtid: tokenId },
  );
  await prisma.session.create({ data: { userId: user.id, tokenId, expiresAt } });
  res.cookie('session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
}

async function signup(req, res) {
  const { email, username, password } = req.body;
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await prisma.user.create({
      data: { displayName: username.trim(), email: normalizedEmail, username: normalizedUsername, passwordHash },
    });
    await createSession(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Email or username is already in use.' });
    throw error;
  }
}

async function login(req, res) {
  const identifier = req.body.identifier.trim().toLowerCase();
  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] } });
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ error: 'Invalid username/email or password.' });
  await createSession(res, user);
  res.json({ user: publicUser(user) });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) return res.status(400).json({ error: 'All password fields are required.' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  if (newPassword !== confirmPassword) return res.status(400).json({ error: 'New passwords do not match.' });

  const userId = BigInt(req.user.id);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) return res.status(400).json({ error: 'Current password is incorrect.' });
  if (await bcrypt.compare(newPassword, user.passwordHash)) return res.status(400).json({ error: 'New password must be different from your current password.' });

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  res.json({ message: 'Password updated successfully.' });
}

async function currentUser(req, res) {
  const user = await prisma.user.findUnique({ where: { id: BigInt(req.user.id) } });
  res.json({ user: publicUser(user) });
}

async function logout(req, res) {
  await prisma.session.updateMany({ where: { tokenId: req.user.jti, revokedAt: null }, data: { revokedAt: new Date() } });
  res.clearCookie('session');
  res.status(204).end();
}

module.exports = { signup, login, changePassword, currentUser, logout };
