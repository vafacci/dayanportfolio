// Lightbox for About section gallery
const aboutImages = document.querySelectorAll('.about-img');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxOverlay = document.querySelector('.lightbox-overlay');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxModal.style.display = 'flex';
  setTimeout(() => lightboxModal.classList.add('active'), 10);
  document.body.classList.add('lightbox-open');
  lightboxClose.focus();
}

function closeLightbox() {
  lightboxModal.classList.remove('active');
  document.body.classList.remove('lightbox-open');
  setTimeout(() => {
    lightboxModal.style.display = 'none';
    lightboxImg.src = '';
  }, 250);
}

aboutImages.forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src, img.alt));
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openLightbox(img.src, img.alt);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (lightboxModal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
    closeLightbox();
  }
}); 