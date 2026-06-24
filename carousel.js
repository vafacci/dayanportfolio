(() => {
  const GAP = 24;

  function getVisibleCount() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function initCarousel(root) {
    const track = root.querySelector('.carousel-track');
    const viewport = root.querySelector('.carousel-viewport');
    if (!track || !viewport) return;

    const items = Array.from(root.querySelectorAll('.carousel-item'));
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dotsContainer = root.querySelector('[data-carousel-dots]');

    let currentIndex = 0;
    let visibleCount = 3;
    let maxIndex = 0;

    function getItemWidth() {
      return (viewport.offsetWidth - GAP * (visibleCount - 1)) / visibleCount;
    }

    function updateLayout() {
      visibleCount = getVisibleCount();
      maxIndex = Math.max(0, items.length - visibleCount);
      currentIndex = Math.min(currentIndex, maxIndex);

      const itemWidth = getItemWidth();
      root.style.setProperty('--carousel-gap', `${GAP}px`);
      root.style.setProperty('--carousel-item-width', `${itemWidth}px`);

      track.style.transform = `translateX(-${currentIndex * (itemWidth + GAP)}px)`;
      updateControls();
      renderDots();
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const itemWidth = getItemWidth();
      track.style.transform = `translateX(-${currentIndex * (itemWidth + GAP)}px)`;
      updateControls();
      updateDots();
    }

    function updateControls() {
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
    }

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const dotCount = maxIndex + 1;
      if (dotCount <= 1) return;

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

    let touchStartX = 0;
    let touchDeltaX = 0;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > 50) {
        goTo(currentIndex + (touchDeltaX < 0 ? 1 : -1));
      }
    });

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) track.style.transition = 'none';

    window.addEventListener('resize', updateLayout);
    updateLayout();
  }

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
})();
