(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem('sc-theme');
  if (stored === 'light' || stored === 'dark') root.dataset.theme = stored;
  window.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    var updateLabel = function () { toggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Use light theme' : 'Use dark theme'); };
    updateLabel();
    toggle.addEventListener('click', function () { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('sc-theme', root.dataset.theme); updateLabel(); });
  });
}());
