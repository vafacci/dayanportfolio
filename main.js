document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
  initNav();
  initContactForm();
});

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('primary-navigation');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', I18n.t(isOpen ? 'nav.close' : 'nav.menu'));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', I18n.t('nav.menu'));
    });
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('.btn-accent, .btn-primary');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    const name = form.querySelector('#contact-name');
    const email = form.querySelector('#contact-email');
    const message = form.querySelector('#contact-message');

    let valid = true;
    [name, email, message].forEach((field) => {
      field.classList.remove('invalid');
      if (!field.checkValidity() || !field.value.trim()) {
        field.classList.add('invalid');
        valid = false;
      }
    });

    if (!valid) {
      statusEl.textContent = I18n.t('contact.error');
      statusEl.classList.add('error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = I18n.t('contact.sending');

    const subject = encodeURIComponent(`Portfolio kontakt — ${name.value.trim()}`);
    const body = encodeURIComponent(
      `Navn: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`
    );

    window.location.href = `mailto:vafaivafai@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      statusEl.textContent = I18n.t('contact.success');
      statusEl.classList.add('success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = I18n.t('contact.send');
    }, 600);
  });

  document.addEventListener('langchange', () => {
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.textContent = I18n.t('contact.send');
    }
    if (statusEl.classList.contains('success')) {
      statusEl.textContent = I18n.t('contact.success');
    } else if (statusEl.classList.contains('error')) {
      statusEl.textContent = I18n.t('contact.error');
    }
  });
}
