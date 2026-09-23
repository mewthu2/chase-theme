if (!customElements.get('chase-quick-sizes')) {
  customElements.define(
    'chase-quick-sizes',
    class ChaseQuickSizes extends HTMLElement {
      connectedCallback() {
        this.toggle = this.querySelector('.chase-quick-sizes__toggle');
        this.error = this.querySelector('.chase-quick-sizes__error');
        this.toggle?.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.setOpen(!this.classList.contains('is-open'));
        });
        this.querySelectorAll('.chase-quick-sizes__size').forEach((button) => {
          button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.add(button);
          });
        });
        this.onOutside = (event) => {
          if (!this.contains(event.target)) this.setOpen(false);
        };
        document.addEventListener('click', this.onOutside);
      }

      disconnectedCallback() {
        document.removeEventListener('click', this.onOutside);
      }

      setOpen(open) {
        if (open) {
          document.querySelectorAll('chase-quick-sizes.is-open').forEach((other) => {
            if (other !== this) other.setOpen(false);
          });
        }
        this.classList.toggle('is-open', open);
        this.toggle?.setAttribute('aria-expanded', String(open));
      }

      async add(button) {
        const variantId = button.dataset.variantId;
        if (!variantId || button.disabled || this.busy) return;

        const cart = document.querySelector('cart-drawer') || document.querySelector('cart-notification');
        this.busy = true;
        button.classList.add('is-loading');
        this.error.hidden = true;

        try {
          const response = await fetch(window.routes.cart_add_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              id: Number(variantId),
              quantity: 1,
              sections: cart ? cart.getSectionsToRender().map((section) => section.id) : [],
              sections_url: window.location.pathname,
            }),
          });
          const data = await response.json();

          if (!response.ok || data.status) {
            this.error.textContent = data.description || data.message || window.cartStrings?.error || '';
            this.error.hidden = false;
            return;
          }

          if (!cart) {
            window.location.href = window.routes.cart_url;
            return;
          }

          if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
            publish(PUB_SUB_EVENTS.cartUpdate, { source: 'chase-quick-sizes', productVariantId: variantId, cartData: data });
          }
          cart.classList.remove('is-empty');
          cart.renderContents(data);
          button.classList.add('is-added');
          setTimeout(() => button.classList.remove('is-added'), 1500);
          this.setOpen(false);
        } catch (error) {
          console.error(error);
          this.error.textContent = window.cartStrings?.error || '';
          this.error.hidden = false;
        } finally {
          this.busy = false;
          button.classList.remove('is-loading');
        }
      }
    }
  );
}
