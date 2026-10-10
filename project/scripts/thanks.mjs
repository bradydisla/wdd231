import { initCommonUI } from './main.mjs';

initCommonUI();

const params = new URLSearchParams(window.location.search);
const summaryList = document.querySelector('#order-summary');
const emptyMessage = document.querySelector('#summary-empty');
const thanksText = document.querySelector('#thanks-text');

// Convert "14:30" to "2:30 PM"
function formatTime(time) {
  if (!time) return 'Not provided';
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

const fields = [
  { label: 'Name', value: params.get('fname') || 'Not provided' },
  { label: 'Email', value: params.get('email') || 'Not provided' },
  { label: 'Pickup time', value: formatTime(params.get('pickupTime')) },
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