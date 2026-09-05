const currentYear = document.getElementById('currentyear');
currentYear.textContent = new Date().getFullYear();

const lastModified = document.getElementById('lastModified');
lastModified.textContent = `Last Modified: ${document.lastModified}`;