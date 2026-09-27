// join.js — footer meta, timestamp field, and membership modals

document.addEventListener('DOMContentLoaded', () => {
  // Footer meta (matches the pattern used by home.js on index.html)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const modifiedEl = document.getElementById('last-modified');
  if (modifiedEl) modifiedEl.textContent = document.lastModified;

  // Stamp the hidden field with the moment the form was loaded.
  const timestampField = document.getElementById('timestamp');
  if (timestampField) {
    timestampField.value = new Date().toISOString();
  }

  // Wire each "Learn more" button to its matching <dialog>.
  document.querySelectorAll('.tier-link').forEach((button) => {
    const dialog = document.getElementById(button.dataset.modal);
    if (!dialog) return;

    button.addEventListener('click', () => dialog.showModal());

    dialog.querySelector('.modal-close')?.addEventListener('click', () => dialog.close());

    // Click on the backdrop closes the modal too.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  // Mobile nav toggle (matches the nav-toggle button in the shared header)
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav?.classList.toggle('open');
  });
});