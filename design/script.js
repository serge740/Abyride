/* Abyride — theme toggle + persistence */
(function () {
  'use strict';

  // Restore theme from localStorage before any paint
  try {
    var saved = localStorage.getItem('abyride-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) { /* ignore */ }

  function init() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var label = btn.querySelector('[data-theme-label]');

    function syncLabel() {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      if (label) label.textContent = current === 'dark' ? 'Dark' : 'Light';
    }
    syncLabel();

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('abyride-theme', next); } catch (e) {}
      syncLabel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
