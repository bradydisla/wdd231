/* =========================================================
   Camara de Comercio de Santiago — index.html (home) behavior
   ========================================================= */

// ---------- mobile nav toggle ----------
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");

navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// ---------- footer: copyright year + last modified ----------
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent = document.lastModified;

// =========================================================
// Weather
// =========================================================

const weatherDisplay = document.querySelector("#weather-display");

const apiKey = "287528980fb332e0cd104745ffd48c15";

// Santiago de los Caballeros, Dominican Republic
const lat = 19.4517;
const lon = -70.697;
const units = "metric";

async function getWeather() {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    displayWeather(currentData, forecastData);
  } catch (error) {
    weatherDisplay.innerHTML = `<p class="weather-status">Weather is unavailable right now.</p>`;
    console.error("Error fetching weather data:", error);
  }
}

// The free forecast endpoint returns data in 3-hour steps, not full
// days, so this groups those steps by calendar date and keeps the
// entry closest to noon as that day's representative forecast.
function getDailyForecast(list) {
  const days = {};

  list.forEach((entry) => {
    const [date, time] = entry.dt_txt.split(" ");
    const hour = Number(time.split(":")[0]);
    const distanceFromNoon = Math.abs(hour - 12);

    if (!days[date] || distanceFromNoon < days[date].distanceFromNoon) {
      days[date] = { entry, distanceFromNoon };
    }
  });

  const today = new Date().toISOString().split("T")[0];

  return Object.entries(days)
    .filter(([date]) => date !== today)
    .slice(0, 3)
    .map(([, value]) => value.entry);
}

function displayWeather(current, forecast) {
  const temp = Math.round(current.main.temp);
  const description = current.weather[0].description;
  const dailyForecast = getDailyForecast(forecast.list);

  const forecastHTML = dailyForecast
    .map((day) => {
      const date = new Date(day.dt_txt.replace(" ", "T"));
      const label = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayTemp = Math.round(day.main.temp);
      return `
        <div class="forecast-day">
          <span class="day-label">${label}</span>
          <span>${dayTemp}&deg;C</span>
        </div>
      `;
    })
    .join("");

  weatherDisplay.innerHTML = `
    <div class="weather-now">
      <span class="weather-temp">${temp}&deg;C</span>
      <span class="weather-desc">${description}</span>
    </div>
    <div class="forecast-list">
      ${forecastHTML}
    </div>
  `;
}

getWeather();

// =========================================================
// Member spotlights
// =========================================================

const spotlightsDisplay = document.querySelector("#members-display");

const membershipLabels = {
  1: "Member",
  2: "Silver Member",
  3: "Gold Member",
};

async function getSpotlights() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();
    displaySpotlights(data.members);
  } catch (error) {
    spotlightsDisplay.innerHTML = `<p class="members-status">Spotlights are unavailable right now.</p>`;
    console.error("Error fetching member data:", error);
  }
}

// Gold (3) and Silver (2) members only, shuffled, showing 2 or 3 at random
function pickSpotlights(members) {
  const eligible = members.filter(
    (member) => member.membership === 2 || member.membership === 3
  );
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const count = Math.random() < 0.5 ? 2 : 3;
  return shuffled.slice(0, count);
}

function displaySpotlights(members) {
  const spotlights = pickSpotlights(members);
  spotlightsDisplay.innerHTML = "";

  spotlights.forEach((member) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.setAttribute("data-level", member.membership);

    card.innerHTML = `
      <div class="card-top">
        <img src="images/${member.image}" alt="${member.name} logo" width="52" height="52" loading="lazy" />
        <div>
          <h2>${member.name}</h2>
          <span class="badge" data-level="${member.membership}">${membershipLabels[member.membership]}</span>
        </div>
      </div>
      <div class="card-body">
        <p>${member.address}</p>
        <p>${member.phone}</p>
      </div>
      <div class="card-actions">
        <a href="${member.website}" target="_blank" rel="noopener">Visit website</a>
        <a href="tel:${member.phone.replace(/[^\d+]/g, "")}">Call</a>
      </div>
    `;

    spotlightsDisplay.appendChild(card);
  });
}

getSpotlights();