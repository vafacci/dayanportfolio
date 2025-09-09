// Carousel logic for Selected Projects
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const leftArrow = document.querySelector('.carousel-arrow.left');
const rightArrow = document.querySelector('.carousel-arrow.right');
const dots = Array.from(document.querySelectorAll('.carousel-dot'));
let currentIndex = 0;
let isAnimating = false;
let autoplayTimer = null;

function updateCarousel(newIndex, animate = true) {
  if (isAnimating || newIndex === currentIndex || newIndex < 0 || newIndex >= slides.length) return;
  isAnimating = true;
  // Remove active class from all slides and dots
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  // Add active to new slide and dot
  slides[newIndex].classList.add('active');
  dots[newIndex].classList.add('active');
  // Animate track
  const offset = -newIndex * 100;
  if (animate) {
    track.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
  } else {
    track.style.transition = 'none';
  }
  track.style.transform = `translateX(${offset}%)`;
  setTimeout(() => {
    isAnimating = false;
  }, animate ? 500 : 0);
  currentIndex = newIndex;
}

leftArrow.addEventListener('click', () => {
  updateCarousel(currentIndex - 1);
});
rightArrow.addEventListener('click', () => {
  updateCarousel(currentIndex + 1);
});
dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => updateCarousel(idx));
});

// Touch/swipe support
let startX = 0;
let deltaX = 0;
let isTouching = false;
const threshold = 50;
const trackWrapper = document.querySelector('.carousel-track-wrapper');

trackWrapper.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  isTouching = true;
  startX = e.touches[0].clientX;
  deltaX = 0;
  track.style.transition = 'none';
}, {passive: true});

trackWrapper.addEventListener('touchmove', (e) => {
  if (!isTouching) return;
  deltaX = e.touches[0].clientX - startX;
  track.style.transform = `translateX(${-currentIndex * 100 + (deltaX / trackWrapper.offsetWidth) * 100}%)`;
}, {passive: true});

trackWrapper.addEventListener('touchend', () => {
  if (!isTouching) return;
  isTouching = false;
  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0 && currentIndex > 0) {
      updateCarousel(currentIndex - 1);
    } else if (deltaX < 0 && currentIndex < slides.length - 1) {
      updateCarousel(currentIndex + 1);
    } else {
      updateCarousel(currentIndex, true);
    }
  } else {
    updateCarousel(currentIndex, true);
  }
});

// Keyboard navigation (optional)
document.querySelector('.carousel').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
  if (e.key === 'ArrowRight') updateCarousel(currentIndex + 1);
});

// (Skill card flip/expand/collapse logic removed. No JS needed for skill cards.)
// Initialize
updateCarousel(0, false);

// Autoplay every 1.5s, pause on hover, respects reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function startAutoplay() {
  if (prefersReduced) return;
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    const next = (currentIndex + 1) % slides.length;
    updateCarousel(next);
  }, 5000);
}
function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}
const carouselEl = document.querySelector('.carousel');
if (carouselEl) {
  carouselEl.addEventListener('mouseenter', stopAutoplay);
  carouselEl.addEventListener('mouseleave', startAutoplay);
  startAutoplay();
}

// === Floating Scroll-to-Top FAB (Show on Scroll) ===
document.addEventListener('DOMContentLoaded', function () {
  const backToTop = document.getElementById('back-to-top');
  function toggleScrollBtn() {
    if (window.scrollY > 100) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  if (backToTop) {
    window.addEventListener('scroll', toggleScrollBtn);
    toggleScrollBtn();
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    backToTop.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}); 