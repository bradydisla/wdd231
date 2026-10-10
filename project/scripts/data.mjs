const DATA_URL = 'data/menu.json';

export const categoryLabels = {
  coffee: 'Coffee',
  tea: 'Tea',
  food: 'Food'
};

export function temperatureLabel(temperature) {
  return temperature === 'hot' ? 'Hot' : 'Cold';
}

// Fetch with async/await and error handling
export async function getMenuData() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading menu data:', error);
    return [];
  }
}

export function errorTemplate() {
  return `<p class="error" role="alert">We couldn't load the menu right now. Please try reloading the page.</p>`;
}

// Card template (template literals)
export function cardTemplate(item, withButton = false) {
  return `
    <article class="card">
      <img src="${item.image}" alt="Photo of ${item.name}" loading="lazy" width="300" height="225">
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <p>${categoryLabels[item.category]}, ${temperatureLabel(item.temperature).toLowerCase()}</p>
        <p class="card-price">$${item.price.toFixed(2)}</p>
        <p>${item.dairyFree ? '🌱 Dairy-free' : '🥛 Contains dairy'}</p>
      </div>
      ${withButton
        ? `<button type="button" class="btn-detail" data-id="${item.id}" aria-label="View details for ${item.name}">View details</button>`
        : ''}
    </article>
  `;
}