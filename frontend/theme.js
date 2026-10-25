const themes = ['light', 'dark', 'ocean'];
const savedTheme = localStorage.getItem('socialclub-theme');
const initialTheme = themes.includes(savedTheme) ? savedTheme : 'light';
document.documentElement.dataset.theme = initialTheme;

const updateThemeButtons = (theme) => {
  const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    button.setAttribute('title', `Switch to ${nextTheme} theme`);
  });
};

updateThemeButtons(initialTheme);

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('socialclub-theme', nextTheme);
    updateThemeButtons(nextTheme);
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
