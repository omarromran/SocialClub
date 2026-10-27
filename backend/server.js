require('dotenv').config();
process.env.JWT_SECRET ||= 'local-development-secret-change-this';
const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const messageRoutes = require('./routes/messages');
const { requirePageAuth, requirePageAdmin } = require('./middleware/auth');
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
  '/admin': 'admin.html',
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
  console.warn(`[Warning] ${error.message} (Profile picture uploads will be disabled)`);
}
app.use(express.json({ limit: '1mb', strict: true }));
app.use(cookieParser());
app.use(requestLogger);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'socialclub' }));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.get(Object.keys(legacyPageRoutes), (req, res) => res.redirect(301, legacyPageRoutes[req.path]));
app.get([...protectedPages], requirePageAuth, (req, res) => {
  const pageFile = pageRoutes[req.path];
  const page = fs.readFileSync(path.join(frontendPath, pageFile), 'utf8');
  const activeId = req.path === '/' || req.path === '/index' ? 'for-you' : req.path === '/newPost' ? 'add-post' : ['profile', 'edit-profile'].includes(req.path.slice(1)) ? 'profile' : req.path.slice(1);
  const nav = fs.readFileSync(path.join(frontendPath, 'nav.html'), 'utf8').replace(`data-nav-id="${activeId}"`, `data-nav-id="${activeId}" aria-current="page"`);
  res.set({ 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', Pragma: 'no-cache', Expires: '0' });
  res.type('html').send(page.replace('<!-- SHARED_NAV -->', nav));
});
app.get('/admin', requirePageAuth, requirePageAdmin, (req, res) => {
  const page = fs.readFileSync(path.join(frontendPath, pageRoutes['/admin']), 'utf8');
  res.set({ 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', Pragma: 'no-cache', Expires: '0' });
  res.type('html').send(page);
});
app.get(['/login', '/signup'], (req, res) => {
  const page = fs.readFileSync(path.join(frontendPath, pageRoutes[req.path]), 'utf8');
  res.type('html').send(page);
});
app.use(express.static(frontendPath));
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use((req, res) => res.status(404).type('text').send('Page not found.'));
app.use(errorLogger);
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large.' });
  if (error instanceof SyntaxError && error.status === 400 && error.body !== undefined) {
    return res.status(400).json({ error: 'Request body contains invalid JSON.' });
  }
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
