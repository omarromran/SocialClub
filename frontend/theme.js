const savedTheme = localStorage.getItem('socialclub-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('socialclub-theme', nextTheme);
  });
});

const protectedPaths = new Set(['/', '/index', '/newPost', '/search', '/messages', '/activity', '/profile', '/edit-profile', '/settings']);
const verifyProtectedPageSession = () => {
  if (!protectedPaths.has(window.location.pathname)) return;
  fetch('/api/auth/me', { cache: 'no-store' }).then((response) => {
    if (!response.ok) window.location.replace('/login');
  }).catch(() => window.location.replace('/login'));
};

verifyProtectedPageSession();
window.addEventListener('pageshow', verifyProtectedPageSession);
