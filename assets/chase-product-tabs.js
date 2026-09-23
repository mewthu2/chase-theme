if (!customElements.get('chase-tabs')) {
  customElements.define(
    'chase-tabs',
    class ChaseTabs extends HTMLElement {
      connectedCallback() {
        this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
        this.tabs.forEach((tab, index) => {
          tab.addEventListener('click', () => this.select(index));
          tab.addEventListener('keydown', (event) => this.onKeydown(event, index));
        });
      }

      select(index, focus = false) {
        this.tabs.forEach((tab, i) => {
          const selected = i === index;
          tab.setAttribute('aria-selected', String(selected));
          tab.tabIndex = selected ? 0 : -1;
          const panel = document.getElementById(tab.getAttribute('aria-controls'));
          if (panel) panel.hidden = !selected;
        });
        if (focus) this.tabs[index].focus();
        this.querySelectorAll('chase-carousel').forEach((carousel) => carousel.update?.());
      }

      onKeydown(event, index) {
        const last = this.tabs.length - 1;
        let next = null;
        if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
        if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = last;
        if (next === null) return;
        event.preventDefault();
        this.select(next, true);
      }
    }
  );
}

if (!customElements.get('chase-carousel')) {
  customElements.define(
    'chase-carousel',
    class ChaseCarousel extends HTMLElement {
      connectedCallback() {
        this.track = this.querySelector('.chase-carousel__track');
        this.prev = this.querySelector('[data-dir="prev"]');
        this.next = this.querySelector('[data-dir="next"]');
        if (!this.track) return;
        this.prev?.addEventListener('click', () => this.scroll(-1));
        this.next?.addEventListener('click', () => this.scroll(1));
        this.track.addEventListener('scroll', () => this.update(), { passive: true });
        this.resizeObserver = new ResizeObserver(() => this.update());
        this.resizeObserver.observe(this.track);
        this.update();
      }

      disconnectedCallback() {
        this.resizeObserver?.disconnect();
      }

      scroll(direction) {
        this.track.scrollBy({ left: direction * this.track.clientWidth * 0.9, behavior: 'smooth' });
      }

      update() {
        if (!this.track) return;
        const max = this.track.scrollWidth - this.track.clientWidth - 2;
        const scrollable = max > 0;
        this.classList.toggle('chase-carousel--static', !scrollable);
        if (this.prev) this.prev.disabled = this.track.scrollLeft <= 2;
        if (this.next) this.next.disabled = this.track.scrollLeft >= max;
      }
    }
  );
}
