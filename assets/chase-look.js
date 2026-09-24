if (!customElements.get('chase-look')) {
  customElements.define(
    'chase-look',
    class ChaseLook extends HTMLElement {
      connectedCallback() {
        this.message = this.querySelector('.chase-look__message');
        this.querySelectorAll('[data-look-add]').forEach((button) => {
          button.addEventListener('click', () => this.addItem(button));
        });
        this.querySelector('[data-look-buy-all]')?.addEventListener('click', (event) => this.addAll(event.currentTarget));
        this.querySelectorAll('select[data-look-variant]').forEach((select) => {
          select.addEventListener('change', () => select.classList.remove('is-invalid'));
        });
      }

      showMessage(text) {
        this.message.textContent = text || '';
        this.message.hidden = !text;
      }

      variantFor(item) {
        const input = item.querySelector('[data-look-variant]');
        if (!input || !input.value) {
          input?.classList.add('is-invalid');
          input?.focus();
          return null;
        }
        return Number(input.value);
      }

      mainVariant() {
        const sectionId = this.dataset.sectionId;
        const form = document.querySelector(`#product-form-${sectionId}`);
        const submit = document.getElementById(`ProductSubmitButton-${sectionId}`);
        const input = form?.querySelector('input[name="id"]');
        if (!input || !input.value || input.disabled || submit?.disabled) return null;
        return Number(input.value);
      }

      async addItem(button) {
        const item = button.closest('[data-look-item]');
        const id = this.variantFor(item);
        if (!id) return;
        await this.post([{ id, quantity: 1 }], button);
      }

      async addAll(button) {
        const items = [];
        let missing = false;
        this.querySelectorAll('[data-look-item]').forEach((item) => {
          const input = item.querySelector('[data-look-variant]');
          if (!input) return;
          if (!input.value) {
            input.classList.add('is-invalid');
            missing = true;
            return;
          }
          items.push({ id: Number(input.value), quantity: 1 });
        });

        if (missing) {
          this.showMessage(window.chaseStrings?.selectAll);
          this.querySelector('.is-invalid')?.focus();
          return;
        }

        const main = this.mainVariant();
        if (main) items.unshift({ id: main, quantity: 1 });
        if (!items.length) return;
        await this.post(items, button);
      }

      async post(items, button) {
        if (this.busy) return;
        const cart = document.querySelector('cart-drawer') || document.querySelector('cart-notification');
        this.busy = true;
        button.setAttribute('aria-busy', 'true');
        button.disabled = true;
        this.showMessage('');

        try {
          const response = await fetch(`${window.routes.cart_add_url}.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              items,
              sections: cart ? cart.getSectionsToRender().map((section) => section.id) : [],
              sections_url: window.location.pathname,
            }),
          });
          const data = await response.json();

          if (!response.ok || data.status) {
            this.showMessage(data.description || data.message || window.cartStrings?.error);
            return;
          }

          if (!cart) {
            window.location.href = window.routes.cart_url;
            return;
          }

          if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
            publish(PUB_SUB_EVENTS.cartUpdate, { source: 'chase-look', cartData: data });
          }
          cart.classList.remove('is-empty');
          cart.renderContents(data);
        } catch (error) {
          console.error(error);
          this.showMessage(window.cartStrings?.error);
        } finally {
          this.busy = false;
          button.removeAttribute('aria-busy');
          button.disabled = false;
        }
      }
    }
  );
}
