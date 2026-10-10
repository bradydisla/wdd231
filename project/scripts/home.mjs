import { initCommonUI } from './main.mjs';
import { getMenuData, cardTemplate, errorTemplate } from './data.mjs';

initCommonUI();

const FEATURED_IDS = [1, 3, 9];
const featuredContainer = document.querySelector('#featured-cards');

async function showFeatured() {
  const items = await getMenuData();
  const featured = items.filter(item => FEATURED_IDS.includes(item.id));

  if (featured.length === 0) {
    featuredContainer.innerHTML = errorTemplate();
    return;
  }

  featuredContainer.innerHTML = featured.map(item => cardTemplate(item)).join('');
}

showFeatured();