(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const REVEAL_ATTR = 'data-reveal';
  const REVEALED_CLASS = 'is-revealed';

  const elements = Array.from(document.querySelectorAll(`[${REVEAL_ATTR}]`));
  if (elements.length === 0) return;

  elements.forEach((el) => {
    el.style.willChange = 'opacity, transform';
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add(REVEALED_CLASS);
          obs.unobserve(entry.target);
        }
      }
    },
    { root: null, rootMargin: '0px', threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
})();


