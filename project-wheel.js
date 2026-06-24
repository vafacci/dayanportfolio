(() => {
  const WHEEL_SLOTS = 18;
  const ANGLE_PER_SLOT = 14;
  const POINTER_ANGLE = -90;
  const LERP = 0.14;
  const WHEEL_DELTA_THRESHOLD = 10;
  const TOUCH_STEP_THRESHOLD = 42;
  const VISIBLE_ARC_HALF = ANGLE_PER_SLOT * 3;

  function t(key) {
    return typeof I18n !== 'undefined' ? I18n.t(key) : key;
  }

  function initProjectWheel() {
    const root = document.querySelector('[data-project-wheel]');
    if (!root || !window.PORTFOLIO_PROJECTS?.length) return;

    const baseProjects = window.PORTFOLIO_PROJECTS;
    const projectCount = baseProjects.length;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const lang = () => (I18n?.lang === 'en' ? 'en' : 'da');

    const pick = (field) => field?.[lang()] ?? field?.da ?? '';
    const pickList = (field) => {
      const value = field?.[lang()] ?? field?.da ?? [];
      return Array.isArray(value) ? value : [];
    };

    const slots = Array.from({ length: WHEEL_SLOTS }, (_, i) => ({
      slotIndex: i,
      projectIndex: i % projectCount,
      project: baseProjects[i % projectCount],
    }));

    const cycleAngle = ANGLE_PER_SLOT * projectCount;

    const circle = root.querySelector('.project-wheel__circle');
    const detail = root.querySelector('.project-wheel__detail');
    const mobileList = root.querySelector('.project-wheel__mobile-list');
    const viewport = root.querySelector('.project-wheel__viewport');

    let rotation = POINTER_ANGLE;
    let targetRotation = POINTER_ANGLE;
    let activeProjectIndex = 0;
    let rafId = 0;
    let lastDetailIndex = -1;
    let scrollLocked = false;
    let touchStepped = false;
    let touchStartY = 0;

    function rotationForSlot(slot) {
      return POINTER_ANGLE - slot * ANGLE_PER_SLOT;
    }

    function snapRotationToSlot(slot) {
      let snapped = rotationForSlot(slot);
      while (snapped - targetRotation > 180) snapped -= 360;
      while (snapped - targetRotation < -180) snapped += 360;
      targetRotation = snapped;
    }

    function stepBy(direction) {
      const slot = getActiveSlotIndex(targetRotation);
      const nextSlot = (slot + direction + WHEEL_SLOTS) % WHEEL_SLOTS;
      snapRotationToSlot(nextSlot);
    }

    function lockScrollStep() {
      scrollLocked = true;
      const unlock = () => {
        if (Math.abs(targetRotation - rotation) > 0.5) {
          requestAnimationFrame(unlock);
          return;
        }
        setTimeout(() => {
          scrollLocked = false;
        }, 280);
      };
      unlock();
    }

    function tryScrollStep(delta) {
      if (scrollLocked) return;
      if (Math.abs(delta) < WHEEL_DELTA_THRESHOLD) return;
      stepBy(delta > 0 ? 1 : -1);
      lockScrollStep();
    }

    function buildCircle() {
      if (!circle) return;
      circle.innerHTML = slots
        .map(
          ({ slotIndex, project }) => `
          <li class="project-wheel__arm" data-slot="${slotIndex}" style="--arm-angle: ${slotIndex * ANGLE_PER_SLOT}deg">
            <div class="project-wheel__arm-spoke">
              <div class="project-wheel__arm-label">
                <button type="button" class="project-wheel__arm-btn" data-slot-jump="${slotIndex}">
                  <span data-i18n="${project.nameKey}">${t(project.nameKey)}</span>
                </button>
              </div>
            </div>
          </li>`
        )
        .join('');
    }

    function buildDetail() {
      if (!detail) return;
      detail.innerHTML = `
        <article class="project-wheel__panel is-active">
          <div class="project-wheel__visual">
            <img src="" alt="" id="wheel-project-image">
          </div>
          <div class="project-wheel__meta">
            <div class="project-wheel__title-row">
              <h2 class="project-wheel__title" id="wheel-project-title"></h2>
              <a href="#" class="project-wheel__link" id="wheel-project-link" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M5 13L13 5M13 5H6M13 5V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </div>
            <p class="project-wheel__desc" id="wheel-project-desc"></p>
            <ul class="project-wheel__tags" id="wheel-project-tags"></ul>
            <div class="project-wheel__footer">
              <span id="wheel-project-period"></span>
              <span id="wheel-project-role"></span>
            </div>
          </div>
        </article>`;
    }

    function buildMobile() {
      if (!mobileList) return;
      mobileList.innerHTML = baseProjects
        .map(
          (project) => `
          <article class="project-wheel__mobile-card">
            <div class="project-wheel__visual">
              <img src="${project.image}" alt="${t(project.nameKey)}" loading="lazy">
            </div>
            <div class="project-wheel__meta">
              <h2 class="project-wheel__title" data-i18n="${project.nameKey}">${t(project.nameKey)}</h2>
              <p class="project-wheel__desc" data-i18n="${project.descKey}">${t(project.descKey)}</p>
              <ul class="project-wheel__tags" data-project-tags="${project.id}"></ul>
              <a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer" data-i18n="${project.ctaKey}">${t(project.ctaKey)}</a>
            </div>
          </article>`
        )
        .join('');
    }

    const imageEl = () => detail?.querySelector('#wheel-project-image');
    const titleEl = () => detail?.querySelector('#wheel-project-title');
    const linkEl = () => detail?.querySelector('#wheel-project-link');
    const tagsEl = () => detail?.querySelector('#wheel-project-tags');
    const descEl = () => detail?.querySelector('#wheel-project-desc');
    const periodEl = () => detail?.querySelector('#wheel-project-period');
    const roleEl = () => detail?.querySelector('#wheel-project-role');

    function renderTagsFor(container, project) {
      if (!container || !project) return;
      container.innerHTML = pickList(project.tags)
        .map((tag) => `<li><span class="project-wheel__tag">${tag}</span></li>`)
        .join('');
    }

    function renderMobileTags() {
      root.querySelectorAll('[data-project-tags]').forEach((ul) => {
        const project = baseProjects.find((p) => p.id === ul.dataset.projectTags);
        renderTagsFor(ul, project);
      });
    }

    function normalizeAngle(deg) {
      let angle = deg % 360;
      if (angle > 180) angle -= 360;
      if (angle < -180) angle += 360;
      return angle;
    }

    function shortestAngleDiff(from, to) {
      return normalizeAngle(from - to);
    }

    function getArmWorldAngle(slot) {
      return slot * ANGLE_PER_SLOT + rotation;
    }

    function getActiveSlotIndex(fromAngle = rotation) {
      let diff = POINTER_ANGLE - fromAngle;
      diff = ((diff % 360) + 360) % 360;
      return Math.round(diff / ANGLE_PER_SLOT) % WHEEL_SLOTS;
    }

    function getStartSlot() {
      const middleProject = Math.round((projectCount - 1) / 2);
      const middleWheel = Math.floor(WHEEL_SLOTS / 2);
      const projectOffset = middleProject - (middleWheel % projectCount);
      return (middleWheel + projectOffset + WHEEL_SLOTS) % WHEEL_SLOTS;
    }

    function updateDetail(projectIndex) {
      const project = baseProjects[projectIndex];
      if (!project) return;
      activeProjectIndex = projectIndex;

      const img = imageEl();
      if (img) {
        if (lastDetailIndex !== projectIndex) {
          img.style.opacity = '0';
          const nextSrc = project.image;
          const preload = new Image();
          preload.onload = () => {
            img.src = nextSrc;
            img.alt = t(project.nameKey);
            requestAnimationFrame(() => {
              img.style.opacity = '1';
            });
          };
          preload.src = nextSrc;
        } else {
          img.src = project.image;
          img.alt = t(project.nameKey);
        }
      }
      if (titleEl()) {
        titleEl().textContent = t(project.nameKey);
        titleEl().dataset.i18n = project.nameKey;
      }
      if (descEl()) {
        descEl().textContent = t(project.descKey);
        descEl().dataset.i18n = project.descKey;
      }
      if (linkEl()) {
        linkEl().href = project.link;
        linkEl().setAttribute('aria-label', t(project.ctaKey));
      }
      renderTagsFor(tagsEl(), project);
      if (periodEl()) periodEl().textContent = pick(project.period);
      if (roleEl()) roleEl().textContent = pick(project.role);
      lastDetailIndex = projectIndex;
    }

    function highlightArms() {
      const activeSlot = getActiveSlotIndex(targetRotation);
      circle?.querySelectorAll('.project-wheel__arm').forEach((arm) => {
        const slot = Number(arm.dataset.slot);
        const worldAngle = getArmWorldAngle(slot);
        const diff = shortestAngleDiff(worldAngle, POINTER_ANGLE);
        const distance = Math.abs(diff);
        const isVisible = distance <= VISIBLE_ARC_HALF;

        arm.classList.toggle('is-active', slot === activeSlot);
        arm.style.visibility = isVisible ? 'visible' : 'hidden';
        arm.style.pointerEvents = isVisible ? '' : 'none';

        if (!isVisible) {
          arm.style.opacity = '0';
          return;
        }

        const opacity = Math.max(0.32, 1 - (distance / VISIBLE_ARC_HALF) * 0.68);
        arm.style.opacity = String(opacity);
      });
    }

    function wrapRotation() {
      if (rotation > cycleAngle * 40) {
        rotation -= cycleAngle * 20;
        targetRotation -= cycleAngle * 20;
      } else if (rotation < -cycleAngle * 40) {
        rotation += cycleAngle * 20;
        targetRotation += cycleAngle * 20;
      }
    }

    function applyRotation() {
      wrapRotation();
      if (circle) circle.style.transform = `rotate(${rotation}deg)`;
      const activeSlot = getActiveSlotIndex(targetRotation);
      updateDetail(slots[activeSlot].projectIndex);
      highlightArms();
    }

    function jumpToSlot(slotIndex) {
      snapRotationToSlot(slotIndex);
      rotation = targetRotation;
      applyRotation();
    }

    function lockPageScroll() {
      if (prefersReduced || isMobile) return;
      document.documentElement.classList.add('wheel-scroll-lock');
    }

    function tick() {
      const diff = targetRotation - rotation;
      if (Math.abs(diff) > 0.01) {
        rotation += diff * LERP;
        applyRotation();
      } else if (rotation !== targetRotation) {
        rotation = targetRotation;
        applyRotation();
      }
      rafId = requestAnimationFrame(tick);
    }

    function bindWheelScroll() {
      if (prefersReduced || isMobile) return;

      lockPageScroll();

      const handleWheel = (e) => {
        e.preventDefault();
        tryScrollStep(e.deltaY);
      };

      window.addEventListener('wheel', handleWheel, { passive: false });
      viewport?.addEventListener('wheel', handleWheel, { passive: false });

      const onTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
        touchStepped = false;
      };

      const onTouchMove = (e) => {
        e.preventDefault();
        if (touchStepped || scrollLocked) return;
        const delta = touchStartY - e.touches[0].clientY;
        if (Math.abs(delta) < TOUCH_STEP_THRESHOLD) return;
        stepBy(delta > 0 ? 1 : -1);
        lockScrollStep();
        touchStepped = true;
      };

      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
    }

    buildCircle();
    buildDetail();
    buildMobile();
    renderMobileTags();
    const startSlot = getStartSlot();
    rotation = rotationForSlot(startSlot);
    targetRotation = rotation;
    applyRotation();
    bindWheelScroll();
    rafId = requestAnimationFrame(tick);

    circle?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-slot-jump]');
      if (!btn) return;
      jumpToSlot(Number(btn.dataset.slotJump));
    });

    document.addEventListener('langchange', () => {
      renderMobileTags();
      lastDetailIndex = -1;
      updateDetail(activeProjectIndex);
      circle?.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
      });
      detail?.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
      });
      mobileList?.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
      });
    });

    window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectWheel);
  } else {
    initProjectWheel();
  }
})();
