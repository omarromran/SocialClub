const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

async function requireAuth(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: 'Please log in.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    const session = await prisma.session.findFirst({
      where: { tokenId: req.user.jti, revokedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true },
    });
    if (!session) return res.status(401).json({ error: 'Your session is no longer active.' });
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
    const session = await prisma.session.findFirst({
      where: { tokenId: user.jti, revokedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true },
    });
    if (!session) return res.redirect('/login');
    req.user = user;
    next();
  } catch {
    res.redirect('/login');
  }
}

function requireAdmin(req, res, next) {
  prisma.user.findUnique({ where: { id: BigInt(req.user.id) }, select: { isAdmin: true, admin: { select: { id: true } } } })
    .then((user) => {
      if (!user || (!user.isAdmin && !user.admin)) return res.status(403).json({ error: 'Admin access is required.' });
      next();
    })
    .catch(next);
}

function requirePageAdmin(req, res, next) {
  prisma.user.findUnique({ where: { id: BigInt(req.user.id) }, select: { isAdmin: true, admin: { select: { id: true } } } })
    .then((user) => {
      if (!user || (!user.isAdmin && !user.admin)) return res.redirect('/');
      next();
    })
    .catch(next);
}

module.exports = { requireAuth, requirePageAuth, requireAdmin, requirePageAdmin };
