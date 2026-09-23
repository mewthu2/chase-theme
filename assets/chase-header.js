(() => {
  const desktop = window.matchMedia('(min-width: 990px) and (hover: hover)');
  const timers = new WeakMap();

  const bind = (details) => {
    if (details.dataset.chaseHover) return;
    details.dataset.chaseHover = 'true';
    const li = details.closest('li') || details;

    li.addEventListener('mouseenter', () => {
      if (!desktop.matches) return;
      clearTimeout(timers.get(details));
      document.querySelectorAll('.header__inline-menu details.mega-menu[open]').forEach((other) => {
        if (other !== details) other.removeAttribute('open');
      });
      details.setAttribute('open', '');
      details.querySelector('summary')?.setAttribute('aria-expanded', 'true');
    });

    li.addEventListener('mouseleave', () => {
      if (!desktop.matches) return;
      timers.set(
        details,
        setTimeout(() => {
          details.removeAttribute('open');
          details.querySelector('summary')?.setAttribute('aria-expanded', 'false');
        }, 150)
      );
    });
  };

  const init = () => document.querySelectorAll('.header__inline-menu details.mega-menu').forEach(bind);
  init();
  document.addEventListener('shopify:section:load', init);
})();
