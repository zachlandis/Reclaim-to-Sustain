const header = document.getElementById('site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 16);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileMenu.hidden = open;
    document.body.classList.toggle('menu-open', !open);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('is-visible'));
}

const leadForm = document.getElementById('lead-form');
const formStatus = document.getElementById('form-status');
const submitButton = document.getElementById('form-submit');

if (leadForm && formStatus && submitButton) {
  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const accessKey = leadForm.querySelector('[name="access_key"]')?.value?.trim();
    if (!accessKey || accessKey === 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
      formStatus.textContent = 'Add your Web3Forms access key in index.html before publishing.';
      formStatus.className = 'form-status error';
      return;
    }

    if (!leadForm.reportValidity()) return;

    const originalButton = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    formStatus.textContent = 'Sending your request…';
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(leadForm);
      const payload = Object.fromEntries(formData.entries());

      // Web3Forms supports replyto so replies go directly to the customer.
      payload.replyto = payload.email || '';

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Submission failed (${response.status})`);
      }

      leadForm.reset();
      formStatus.textContent = 'Thanks — your assessment request was sent. We’ll be in touch soon.';
      formStatus.className = 'form-status success';
    } catch (error) {
      console.error('Web3Forms submission error:', error);
      formStatus.textContent = error?.message
        ? `Couldn’t send: ${error.message}`
        : 'Something went wrong. Please try again.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButton;
    }
  });
}
