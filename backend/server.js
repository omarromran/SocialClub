require('dotenv').config();
process.env.JWT_SECRET ||= 'local-development-secret-change-this';
const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const { requirePageAuth } = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { getR2Config } = require('./config/r2');

const app = express();
const frontendPath = path.join(__dirname, '..', 'frontend');
const port = Number(process.env.PORT || 3000);
const pageRoutes = {
  '/': 'index.html',
  '/index': 'index.html',
  '/newPost': 'newPost.html',
  '/search': 'search.html',
  '/messages': 'messages.html',
  '/activity': 'activity.html',
  '/profile': 'profile.html',
  '/edit-profile': 'edit-profile.html',
  '/settings': 'settings.html',
  '/login': 'login.html',
  '/signup': 'signup.html',
};
const protectedPages = new Set(['/', '/index', '/newPost', '/search', '/messages', '/activity', '/profile', '/edit-profile', '/settings']);
const legacyPageRoutes = {
  '/index.html': '/',
  '/newPost.html': '/newPost',
  '/search.html': '/search',
  '/messages.html': '/messages',
  '/activity.html': '/activity',
  '/profile.html': '/profile',
  '/edit-profile.html': '/edit-profile',
  '/settings.html': '/settings',
  '/login.html': '/login',
  '/signup.html': '/signup',
};
try {
  getR2Config();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.get(Object.keys(legacyPageRoutes), (req, res) => res.redirect(301, legacyPageRoutes[req.path]));
app.get([...protectedPages], requirePageAuth, (req, res) => {
  const pageFile = pageRoutes[req.path];
  const page = fs.readFileSync(path.join(frontendPath, pageFile), 'utf8');
  const activeId = req.path === '/' || req.path === '/index' ? 'for-you' : req.path === '/newPost' ? 'add-post' : ['profile', 'edit-profile'].includes(req.path.slice(1)) ? 'profile' : req.path.slice(1);
  const nav = fs.readFileSync(path.join(frontendPath, 'nav.html'), 'utf8').replace(`data-nav-id="${activeId}"`, `data-nav-id="${activeId}" aria-current="page"`);
  res.type('html').send(page.replace('<!-- SHARED_NAV -->', nav));
});
app.get(['/login', '/signup'], (req, res) => {
  const page = fs.readFileSync(path.join(frontendPath, pageRoutes[req.path]), 'utf8');
  res.type('html').send(page);
});
app.use(express.static(frontendPath));
app.use(errorLogger);
app.use((error, req, res, next) => {
  if (error instanceof require('multer').MulterError) {
    return res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error: 'The profile-picture upload is invalid or too large.' });
  }
  if (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
  return next();
});
app.listen(port, () => console.log(`SocialClub running at http://localhost:${port}`));
