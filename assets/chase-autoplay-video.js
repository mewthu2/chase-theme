(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const load = (container) => {
    if (container.getAttribute('loaded')) return container.querySelector('video, iframe');
    const template = container.querySelector('template');
    if (!template) return null;
    const element = template.content.firstElementChild.cloneNode(true);
    const media = element.matches('video, iframe') ? element : element.querySelector('video, iframe');
    if (!media) return null;
    container.appendChild(media);
    container.setAttribute('loaded', true);
    if (media.nodeName === 'VIDEO') {
      media.muted = true;
      media.playsInline = true;
      media.addEventListener('pause', () => {
        if (container.dataset.chaseVisible === 'true') setTimeout(() => media.play().catch(() => {}), 250);
      });
    }
    return media;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const container = entry.target;
        container.dataset.chaseVisible = String(entry.isIntersecting);
        if (!entry.isIntersecting) {
          const video = container.querySelector('video');
          if (video && !video.paused) {
            container.dataset.chaseVisible = 'false';
            video.pause();
          }
          return;
        }
        const media = load(container);
        if (media && media.nodeName === 'VIDEO') media.play().catch(() => {});
      });
    },
    { threshold: 0.35 }
  );

  const init = () => {
    if (reduceMotion.matches) return;
    document.querySelectorAll('deferred-media.chase-autoplay:not([data-chase-observed])').forEach((container) => {
      container.dataset.chaseObserved = 'true';
      observer.observe(container);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, () => requestAnimationFrame(init));
  }
})();
