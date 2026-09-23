(() => {
  const desktop = window.matchMedia('(min-width: 990px) and (hover: hover)');
  const timers = new WeakMap();

  const bind = (details) => {
    if (details.dataset.chaseHover) return;
    details.dataset.chaseHover = 'true';
    const li = details.closest('li') || details;
    const summary = details.querySelector('summary');

    summary?.addEventListener('click', (event) => {
      if (!desktop.matches || details.dataset.chaseHovered !== 'true') return;
      event.preventDefault();
    });

    li.addEventListener('mouseenter', () => {
      if (!desktop.matches) return;
      clearTimeout(timers.get(details));
      document.querySelectorAll('.header__inline-menu details.mega-menu[open]').forEach((other) => {
        if (other !== details) other.removeAttribute('open');
      });
      details.setAttribute('open', '');
      details.dataset.chaseHovered = 'true';
      details.querySelector('summary')?.setAttribute('aria-expanded', 'true');
    });

    li.addEventListener('mouseleave', () => {
      if (!desktop.matches) return;
      timers.set(
        details,
        setTimeout(() => {
          details.removeAttribute('open');
          details.dataset.chaseHovered = 'false';
          details.querySelector('summary')?.setAttribute('aria-expanded', 'false');
        }, 150)
      );
    });
  };

  const init = () => document.querySelectorAll('.header__inline-menu details.mega-menu').forEach(bind);
  init();
  document.addEventListener('shopify:section:load', init);
})();

(() => {
  const init = () => {
    const wrapper = document.querySelector('.chase-header-transparent');
    if (!wrapper || wrapper.dataset.chaseTransparent) return;
    wrapper.dataset.chaseTransparent = 'true';

    const update = () => wrapper.classList.toggle('is-solid', window.scrollY > 10);
    window.addEventListener('scroll', update, { passive: true });
    update();

    const setHeight = () =>
      document.documentElement.style.setProperty('--chase-header-height', `${wrapper.offsetHeight}px`);
    new ResizeObserver(setHeight).observe(wrapper);
    setHeight();
  };

  init();
  document.addEventListener('shopify:section:load', init);
})();
