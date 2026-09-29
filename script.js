const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileMenu.hidden = open;
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const leadForm = document.getElementById('lead-form');
const formStatus = document.getElementById('form-status');
const submitButton = document.getElementById('form-submit');

if (leadForm && formStatus && submitButton) {
  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const accessKey = leadForm.querySelector('[name="access_key"]')?.value?.trim();

    if (!accessKey || accessKey === '23e56279-a444-453d-9f1f-240cc7fe648c') {
      formStatus.textContent = 'Form setup is incomplete. Please add the Web3Forms access key.';
      formStatus.className = 'form-status error';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    formStatus.textContent = 'Sending your request…';
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(leadForm);
      formData.append('replyto', formData.get('email') || '');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Submission failed');
      }

      leadForm.reset();
      formStatus.textContent = 'Thanks — your yard assessment request was sent. We’ll be in touch soon.';
      formStatus.className = 'form-status success';
    } catch (error) {
      console.error('Web3Forms submission error:', error);
      formStatus.textContent = 'Something went wrong. Please try again in a moment.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Request an Assessment';
    }
  });
}
