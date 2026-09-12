const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('primary-nav');

menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});