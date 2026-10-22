const savedTheme = localStorage.getItem('socialclub-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('socialclub-theme', nextTheme);
  });
});
