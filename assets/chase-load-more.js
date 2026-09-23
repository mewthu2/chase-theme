if (!customElements.get('chase-load-more')) {
  customElements.define(
    'chase-load-more',
    class ChaseLoadMore extends HTMLElement {
      connectedCallback() {
        this.button = this.querySelector('.chase-load-more__button');
        this.button?.addEventListener('click', () => this.load());
      }

      async load() {
        const nextUrl = this.dataset.nextUrl;
        const grid = document.getElementById('product-grid');
        if (!nextUrl || !grid || this.loading) return;

        this.loading = true;
        this.button.setAttribute('aria-busy', 'true');
        this.button.disabled = true;

        try {
          const url = new URL(nextUrl, window.location.origin);
          url.searchParams.set('section_id', this.dataset.sectionId);
          const response = await fetch(url.toString());
          if (!response.ok) throw new Error(response.statusText);
          const html = new DOMParser().parseFromString(await response.text(), 'text/html');

          const items = html.querySelectorAll('#product-grid > li');
          const fragment = document.createDocumentFragment();
          items.forEach((item) => {
            item.classList.remove('scroll-trigger', 'animate--slide-in');
            fragment.appendChild(document.importNode(item, true));
          });
          grid.appendChild(fragment);

          const next = html.querySelector('chase-load-more');
          if (next) {
            this.querySelector('.chase-load-more__status').innerHTML = next.querySelector('.chase-load-more__status').innerHTML;
            this.querySelector('.chase-load-more__bar').innerHTML = next.querySelector('.chase-load-more__bar').innerHTML;
          }

          if (next && next.dataset.nextUrl) {
            this.dataset.nextUrl = next.dataset.nextUrl;
            this.button.disabled = false;
          } else {
            delete this.dataset.nextUrl;
            this.button.remove();
          }

          const pageUrl = new URL(nextUrl, window.location.origin);
          window.history.replaceState(window.history.state, '', pageUrl.pathname + pageUrl.search);
        } catch (error) {
          console.error(error);
          window.location.href = nextUrl;
        } finally {
          this.loading = false;
          this.button?.removeAttribute('aria-busy');
        }
      }
    }
  );
}
