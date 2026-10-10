import { initCommonUI } from './main.mjs';

initCommonUI();

const params = new URLSearchParams(window.location.search);
const summaryList = document.querySelector('#order-summary');
const emptyMessage = document.querySelector('#summary-empty');
const thanksText = document.querySelector('#thanks-text');

const fields = [
  { label: 'Name', value: params.get('fname') },
  { label: 'Email', value: params.get('email') },
  { label: 'Pickup time', value: params.get('pickupTime') },
  { label: 'Notes', value: params.get('notes') || 'No notes' }
];

if (!params.has('fname')) {
  // The page was opened without submitting the form
  summaryList.remove();
  thanksText.remove();
  emptyMessage.hidden = false;
} else {
  fields.forEach(({ label, value }) => {
    const item = document.createElement('li');
    const strong = document.createElement('strong');

    strong.textContent = `${label}: `;
    item.append(strong, value);
    summaryList.append(item);
  });
}