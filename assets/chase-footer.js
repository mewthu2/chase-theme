(() => {
  const desktop = window.matchMedia('(min-width: 750px)');

  const sync = () => {
    document.querySelectorAll('.chase-footer-accordion').forEach((details) => {
      details.open = desktop.matches;
    });
  };

  sync();
  desktop.addEventListener('change', sync);
  document.addEventListener('shopify:section:load', sync);
})();
