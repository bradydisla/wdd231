// thankyou.js — footer meta + displays the required fields submitted from join.html

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const modifiedEl = document.getElementById('last-modified');
  if (modifiedEl) modifiedEl.textContent = document.lastModified;

  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav?.classList.toggle('open');
  });

  const params = new URLSearchParams(window.location.search);

  const fields = {
    firstName: document.getElementById('out-firstName'),
    lastName: document.getElementById('out-lastName'),
    email: document.getElementById('out-email'),
    mobile: document.getElementById('out-mobile'),
    orgName: document.getElementById('out-orgName'),
    timestamp: document.getElementById('out-timestamp'),
  };

  Object.entries(fields).forEach(([key, el]) => {
    if (!el) return;
    const value = params.get(key);
    if (key === 'timestamp' && value) {
      el.textContent = new Date(value).toLocaleString();
    } else {
      el.textContent = value || 'Not provided';
    }
  });
});