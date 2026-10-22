const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const pool = require('../config/database');

async function createSession(res, user) {
  const tokenId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d', jwtid: tokenId });
  await pool.query('INSERT INTO sessions (user_id, token_id, expires_at) VALUES ($1, $2, $3)', [user.id, tokenId, expiresAt]);
  res.cookie('session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
}

async function signup(req, res) {
  const { email, username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const result = await pool.query('INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username', [email.trim().toLowerCase(), username.trim(), passwordHash]);
    await createSession(res, result.rows[0]);
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Email or username is already in use.' });
    throw error;
  }
}

async function login(req, res) {
  const { identifier, password } = req.body;
  const result = await pool.query('SELECT id, email, username, password_hash FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1) LIMIT 1', [identifier.trim()]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: 'Invalid username/email or password.' });
  await createSession(res, user);
  res.json({ user: { id: user.id, email: user.email, username: user.username } });
}

function currentUser(req, res) { res.json({ user: req.user }); }
async function logout(req, res) {
  await pool.query('UPDATE sessions SET revoked_at = NOW() WHERE token_id = $1 AND revoked_at IS NULL', [req.user.jti]);
  res.clearCookie('session');
  res.status(204).end();
}

module.exports = { signup, login, currentUser, logout };
