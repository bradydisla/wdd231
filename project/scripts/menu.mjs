import { initCommonUI } from './main.mjs';
import {
  getMenuData,
  cardTemplate,
  errorTemplate,
  categoryLabels,
  temperatureLabel
} from './data.mjs';

initCommonUI();

const FILTER_KEY = 'selah_filter';
const VALID_FILTERS = ['all', 'coffee', 'tea', 'food', 'dairy-free'];

const menuContainer = document.querySelector('#menu-cards');
const resultCount = document.querySelector('#result-count');
const filterButtons = document.querySelectorAll('.btn-filter');
const modal = document.querySelector('#item-modal');
const modalContent = document.querySelector('#modal-content');
const closeModal = document.querySelector('#close-modal');

let allItems = [];

// Local storage: saved filter preference
function getSavedFilter() {
  try {
    const saved = localStorage.getItem(FILTER_KEY);
    return VALID_FILTERS.includes(saved) ? saved : 'all';
  } catch {
    return 'all';
  }
}

function saveFilter(category) {
  try {
    localStorage.setItem(FILTER_KEY, category);
  } catch (error) {
    console.error('Could not save the filter:', error);
  }
}

// Dynamic generation with map and template literals
function displayItems(items) {
  menuContainer.innerHTML = items.map(item => cardTemplate(item, true)).join('');
  resultCount.textContent = `Showing ${items.length} of ${allItems.length} items`;
}

function filterItems(category) {
  if (category === 'all') return allItems;
  if (category === 'dairy-free') return allItems.filter(item => item.dairyFree);
  return allItems.filter(item => item.category === category);
}

function applyFilter(category) {
  saveFilter(category);

  filterButtons.forEach(btn => {
    const isActive = btn.dataset.category === category;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  displayItems(filterItems(category));
}

// Accessible modal (native dialog: focus is trapped and Escape closes it)
function openModal(id) {
  const item = allItems.find(i => i.id === id);
  if (!item) return;

  modalContent.innerHTML = `
    <img src="${item.image}" alt="Photo of ${item.name}" width="300" height="225">
    <h2 id="modal-title">${item.name}</h2>
    <p><strong>Category:</strong> ${categoryLabels[item.category]}</p>
    <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
    <p><strong>Served:</strong> ${temperatureLabel(item.temperature)}</p>
    <p><strong>Dairy:</strong> ${item.dairyFree ? 'Dairy-free' : 'Contains dairy'}</p>
    <p>${item.description}</p>
  `;
  modal.showModal();
}

menuContainer.addEventListener('click', event => {
  const button = event.target.closest('.btn-detail');
  if (button) {
    openModal(Number(button.dataset.id));
  }
});

closeModal.addEventListener('click', () => modal.close());

// Close when the dark backdrop is clicked
modal.addEventListener('click', event => {
  if (event.target === modal) modal.close();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.category));
});

async function init() {
  allItems = await getMenuData();

  if (allItems.length === 0) {
    menuContainer.innerHTML = errorTemplate();
    resultCount.textContent = '';
    return;
  }

  applyFilter(getSavedFilter());
}

init();