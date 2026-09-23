if (!customElements.get('chase-sticky-atc')) {
  customElements.define(
    'chase-sticky-atc',
    class ChaseStickyAtc extends HTMLElement {
      connectedCallback() {
        this.sectionId = this.dataset.sectionId;
        this.submit = document.getElementById(`ProductSubmitButton-${this.sectionId}`);
        this.button = this.querySelector('.chase-sticky-atc__button');
        this.priceEl = this.querySelector('.chase-sticky-atc__price');
        if (!this.submit) return;

        this.mobile = window.matchMedia('(max-width: 749px)');
        this.observer = new IntersectionObserver(([entry]) => {
          const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          const visible = past && this.mobile.matches;
          this.classList.toggle('is-visible', visible);
          this.setAttribute('aria-hidden', String(!visible));
          this.inert = !visible;
        });
        this.observer.observe(this.submit);

        this.button.addEventListener('click', () => {
          if (this.submit.disabled) return;
          this.submit.click();
        });

        this.sync();
        if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
          this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
            if (event.data.sectionId !== this.sectionId) return;
            requestAnimationFrame(() => this.sync());
          });
        }
      }

      disconnectedCallback() {
        this.observer?.disconnect();
        this.unsubscribe?.();
      }

      sync() {
        const label = this.submit.querySelector('span');
        this.button.disabled = this.submit.disabled;
        if (label) this.button.textContent = label.textContent.trim();

        const price = document.querySelector(`#price-${this.sectionId} .price`);
        if (!price) return;
        const selector = price.classList.contains('price--on-sale')
          ? '.price__sale .price-item--last'
          : '.price__regular .price-item--regular';
        const current = price.querySelector(selector);
        if (current) this.priceEl.textContent = current.textContent.trim();
      }
    }
  );
}
