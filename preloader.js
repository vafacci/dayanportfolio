(() => {
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('preloader-percent');
  const root = document.documentElement;

  const skip = () => {
    root.classList.remove('is-loading');
    preloader?.remove();
    document.dispatchEvent(new CustomEvent('preloader-complete'));
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    skip();
    return;
  }

  if (!preloader || !percentEl) {
    skip();
    return;
  }

  const ASSETS = ['./img/logo-dv.png', './img/hero-portrait.jpg'];
  const MIN_MS = 900;
  const MAX_MS = 5000;
  const start = performance.now();

  let target = 0;
  let displayed = 0;
  let animating = true;

  const tick = () => {
    displayed += (target - displayed) * 0.14;
    if (target === 100 && displayed > 99.5) displayed = 100;
    percentEl.textContent = String(Math.round(displayed));
    if (animating) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  const setTarget = (value) => {
    target = Math.min(100, Math.max(target, value));
  };

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      const done = () => resolve();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });

  let loaded = 0;
  const imageLoads = ASSETS.map((src) =>
    loadImage(src).then(() => {
      loaded += 1;
      setTarget((loaded / ASSETS.length) * 88);
    })
  );

  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  const pageReady =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

  let finished = false;

  const complete = () => {
    if (finished) return;
    finished = true;
    setTarget(100);
    const elapsed = performance.now() - start;
    const delay = Math.max(0, MIN_MS - elapsed);

    setTimeout(() => {
      animating = false;
      percentEl.textContent = '100';
      preloader.classList.add('is-done');
      preloader.setAttribute('aria-busy', 'false');
      root.classList.remove('is-loading');

      const remove = () => preloader.remove();
      preloader.addEventListener('transitionend', remove, { once: true });
      setTimeout(remove, 800);

      document.dispatchEvent(new CustomEvent('preloader-complete'));
    }, delay + 250);
  };

  Promise.race([
    Promise.all([...imageLoads, fontsReady, pageReady]).then(() => complete()),
    new Promise((resolve) => setTimeout(resolve, MAX_MS)).then(() => complete()),
  ]);
})();
