(() => {
  const SLOT_COUNT = 6;
  const AUTOPLAY_MS = 4200;
  const SPREAD_DEG = 360 / SLOT_COUNT;
  const ITEM_GAP = 14;

  function initCoverflow(root) {
    const carousel = root.querySelector('.coverflow__carousel');
    if (!carousel) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const originals = Array.from(carousel.querySelectorAll('.coverflow__item'));
    if (!originals.length) return;

    ensureSlots(carousel, originals, SLOT_COUNT);
    const items = Array.from(carousel.querySelectorAll('.coverflow__item'));
    const count = items.length;

    if (typeof I18n !== 'undefined') I18n.apply();

    let currentIndex = 0;
    let carouselRotation = 0;
    let radius = 0;
    let touchStartX = 0;
    let touchDeltaX = 0;
    let scrollLocked = false;
    let autoplayId = 0;
    let paused = false;

    function ensureSlots(container, sourceItems, targetCount) {
      while (container.children.length < targetCount) {
        const source = sourceItems[container.children.length % sourceItems.length];
        const clone = source.cloneNode(true);
        clone.classList.remove('is-active');
        container.appendChild(clone);
      }
    }

    function lockScrollStep() {
      scrollLocked = true;
      window.setTimeout(() => {
        scrollLocked = false;
      }, 1250);
    }

    function getItemWidth() {
      const w = window.innerWidth;
      if (w < 480) return Math.min(w - 48, 300);
      if (w < 768) return Math.min(w - 96, 320);
      return 350;
    }

    function getItemGap() {
      const w = window.innerWidth;
      if (w < 480) return 10;
      if (w < 768) return 12;
      return ITEM_GAP;
    }

    function layout() {
      const itemWidth = getItemWidth();
      const itemGap = getItemGap();
      const imageHeight = Math.round(itemWidth * (220 / 350));
      const bodyHeight = 96;
      const itemHeight = imageHeight + bodyHeight;

      root.style.setProperty('--coverflow-item-width', `${itemWidth}px`);
      root.style.setProperty('--coverflow-item-height', `${itemHeight}px`);
      root.style.setProperty('--coverflow-container-height', `${itemHeight}px`);
      root.style.setProperty('--coverflow-height', `${itemHeight + 72}px`);

      const halfAngle = Math.PI / count;
      radius = (itemWidth + itemGap) / (2 * Math.sin(halfAngle));

      items.forEach((item, i) => {
        item.style.transform = `rotateY(${i * SPREAD_DEG}deg) translateZ(${radius}px)`;
      });

      applyRotation(false);
    }

    function applyRotation(animate) {
      carousel.style.transition =
        animate && !prefersReduced ? '' : 'none';
      carousel.style.transform = `rotateY(${carouselRotation}deg)`;

      items.forEach((item, i) => {
        const offset = shortestOffset(i, currentIndex);
        const isActive = offset === 0;
        item.classList.toggle('is-active', isActive);
        item.classList.toggle('is-side', Math.abs(offset) === 1);
        item.classList.toggle('is-far', Math.abs(offset) >= 2);
        item.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        item.tabIndex = isActive ? 0 : -1;
      });
    }

    function shortestOffset(index, active) {
      let offset = index - active;
      if (offset > count / 2) offset -= count;
      if (offset < -count / 2) offset += count;
      return offset;
    }

    function goTo(index, animate = true) {
      const next = ((index % count) + count) % count;
      let delta = next - currentIndex;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;

      carouselRotation -= delta * SPREAD_DEG;
      currentIndex = next;
      applyRotation(animate);
    }

    function step(direction) {
      goTo(currentIndex + direction);
      lockScrollStep();
      restartAutoplay();
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    function startAutoplay() {
      if (prefersReduced || count <= 1) return;
      autoplayId = window.setInterval(() => {
        if (paused || scrollLocked) return;
        goTo(currentIndex + 1);
      }, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      window.clearInterval(autoplayId);
      autoplayId = 0;
    }

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i !== currentIndex) goTo(i);
      });
    });

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    root.addEventListener(
      'wheel',
      (e) => {
        if (scrollLocked) {
          e.preventDefault();
          return;
        }
        if (Math.abs(e.deltaY) < 12) return;
        e.preventDefault();
        step(e.deltaY > 0 ? 1 : -1);
      },
      { passive: false }
    );

    root.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
      },
      { passive: true }
    );

    root.addEventListener(
      'touchmove',
      (e) => {
        touchDeltaX = e.touches[0].clientX - touchStartX;
      },
      { passive: true }
    );

    root.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) < 42) return;
      step(touchDeltaX < 0 ? 1 : -1);
    });

    root.addEventListener('mouseenter', () => {
      paused = true;
    });

    root.addEventListener('mouseleave', () => {
      paused = false;
    });

    root.addEventListener('focusin', () => {
      paused = true;
    });

    root.addEventListener('focusout', () => {
      paused = false;
    });

    window.addEventListener('resize', layout);
    layout();
    startAutoplay();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-coverflow]').forEach(initCoverflow);
    });
  } else {
    document.querySelectorAll('[data-coverflow]').forEach(initCoverflow);
  }
})();
