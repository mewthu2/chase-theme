(() => {
  const strings = window.chaseStrings || {};
  let upsellHTML = '';
  let lastProductId = null;

  const getProductId = (state) => state?.product_id || state?.items?.[0]?.product_id || null;
  const getTitle = (state) => state?.product_title || state?.items?.[0]?.product_title || '';

  const insertUpsell = (drawer) => {
    if (!upsellHTML) return;
    const items = drawer.querySelector('cart-drawer-items');
    if (!items || items.querySelector('.chase-upsell')) return;
    items.insertAdjacentHTML('beforeend', upsellHTML);
  };

  const showAdded = (drawer, state) => {
    const inner = drawer.querySelector('.drawer__inner');
    const header = drawer.querySelector('.drawer__header');
    if (!inner || !header) return;
    inner.querySelector('.chase-added')?.remove();
    const banner = document.createElement('div');
    banner.className = 'chase-added';
    banner.setAttribute('role', 'status');
    const title = getTitle(state);
    banner.innerHTML = `<span class="chase-added__icon" aria-hidden="true"></span><span class="chase-added__text"><strong>${
      strings.added || ''
    }</strong>${title ? `<span>${title.replace(/</g, '&lt;')}</span>` : ''}</span>`;
    header.insertAdjacentElement('afterend', banner);
  };

  const loadUpsell = async (drawer, productId) => {
    if (!productId || !window.routes?.product_recommendations_url) return;
    if (productId === lastProductId && upsellHTML) return insertUpsell(drawer);
    lastProductId = productId;
    try {
      const url = `${window.routes.product_recommendations_url}?product_id=${productId}&limit=6&section_id=chase-cart-recommendations`;
      const response = await fetch(url);
      if (!response.ok) return;
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const upsell = html.querySelector('.chase-upsell');
      upsellHTML = upsell ? upsell.outerHTML : '';
      insertUpsell(drawer);
    } catch (error) {
      console.error(error);
    }
  };

  customElements.whenDefined('cart-drawer').then(() => {
    const CartDrawer = customElements.get('cart-drawer');
    const renderContents = CartDrawer.prototype.renderContents;
    CartDrawer.prototype.renderContents = function (parsedState) {
      renderContents.call(this, parsedState);
      showAdded(this, parsedState);
      loadUpsell(this, getProductId(parsedState));
    };
  });

  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source !== 'cart-items') return;
      const drawer = document.querySelector('cart-drawer');
      if (drawer) insertUpsell(drawer);
    });
  }
})();
