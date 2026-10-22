const jwt = require('jsonwebtoken');
const pool = require('../config/database');

async function requireAuth(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: 'Please log in.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT id FROM sessions WHERE token_id = $1 AND revoked_at IS NULL AND expires_at > NOW()',
      [req.user.jti],
    );
    if (result.rowCount === 0) return res.status(401).json({ error: 'Your session is no longer active.' });
    next();
  } catch {
    res.status(401).json({ error: 'Your session has expired.' });
  }
}

async function requirePageAuth(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.redirect('/login');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT id FROM sessions WHERE token_id = $1 AND revoked_at IS NULL AND expires_at > NOW()',
      [user.jti],
    );
    if (result.rowCount === 0) return res.redirect('/login');
    req.user = user;
    next();
  } catch {
    res.redirect('/login');
  }
}

module.exports = { requireAuth, requirePageAuth };
