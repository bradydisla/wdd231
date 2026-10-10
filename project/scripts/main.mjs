export function initCommonUI() {
  // Hamburger menu
  const navToggle = document.querySelector('#menu-toggle');
  const navList = document.querySelector('#nav-list');

  if (navToggle && navList) {
    const icon = navToggle.querySelector('span');

    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      icon.textContent = isOpen ? '✕' : '☰';
    });
  }

  // Wayfinding: mark the current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-list a');

  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('current');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Dynamic footer year
  const yearSpan = document.querySelector('#current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}