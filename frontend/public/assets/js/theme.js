(function () {
  var themes = ['light', 'dark', 'ocean'];
  var root = document.documentElement;
  var stored = localStorage.getItem('sc-theme');
  if (themes.indexOf(stored) !== -1) root.dataset.theme = stored;
  window.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    var next = function () { return themes[(themes.indexOf(root.dataset.theme || 'light') + 1) % themes.length]; };
    var updateLabel = function () { toggle.setAttribute('aria-label', 'Switch to ' + next() + ' theme'); };
    updateLabel();
    toggle.addEventListener('click', function () {
      root.dataset.theme = next();
      localStorage.setItem('sc-theme', root.dataset.theme);
      updateLabel();
    });
  });
}());
