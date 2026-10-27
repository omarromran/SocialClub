const themes = ['sleek-dark', 'tech-saas', 'ocean', 'mocha-gold', 'forest-crimson'];
const savedTheme = localStorage.getItem('socialclub-theme');
const initialTheme = themes.includes(savedTheme) ? savedTheme : 'tech-saas';

const applyTheme = (theme, persist = true) => {
  if (!themes.includes(theme)) return;
  document.documentElement.dataset.theme = theme;
  if (persist) localStorage.setItem('socialclub-theme', theme);
  document.querySelectorAll('[data-theme-choice]').forEach((choice) => {
    const selected = choice.dataset.themeChoice === theme;
    choice.setAttribute('aria-checked', String(selected));
  });
  const index = themes.indexOf(theme);
  const nextTheme = themes[(index + 1) % themes.length];
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    button.setAttribute('title', `Switch to ${nextTheme} theme`);
  });
};

applyTheme(initialTheme, false);

document.querySelectorAll('[data-theme-choice]').forEach((choice) => {
  choice.addEventListener('click', () => applyTheme(choice.dataset.themeChoice));
});

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    applyTheme(themes[(themes.indexOf(currentTheme) + 1) % themes.length]);
  });
});

const protectedPaths = new Set(['/', '/index', '/newPost', '/search', '/messages', '/activity', '/profile', '/edit-profile', '/settings']);
const verifyProtectedPageSession = () => {
  if (window.location.protocol === 'file:') return;
  if (!protectedPaths.has(window.location.pathname)) return;
  fetch('/api/auth/me', { cache: 'no-store' }).then((response) => {
    if (!response.ok) window.location.replace('/login');
  }).catch(() => {
    if (window.location.protocol.startsWith('http')) {
      window.location.replace('/login');
    }
  });
};

verifyProtectedPageSession();
window.addEventListener('pageshow', verifyProtectedPageSession);
