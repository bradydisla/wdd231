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

// The free forecast endpoint returns data in 3-hour steps (UTC), not full
// days. This converts each step to the city's local time using the offset
// the API returns (seconds), groups the steps by local calendar date, and
// keeps the entry closest to local noon as that day's forecast.
function getDailyForecast(list, tzOffset) {
  const days = {};

  list.forEach((entry) => {
    const local = new Date((entry.dt + tzOffset) * 1000).toISOString();
    const date = local.slice(0, 10);
    const hour = Number(local.slice(11, 13));
    const distanceFromNoon = Math.abs(hour - 12);

    if (!days[date] || distanceFromNoon < days[date].distanceFromNoon) {
      days[date] = { entry, date, distanceFromNoon };
    }
  });

  const today = new Date(Date.now() + tzOffset * 1000).toISOString().slice(0, 10);

  return Object.values(days)
    .filter((day) => day.date !== today)
    .slice(0, 3);
}

function displayWeather(current, forecast) {
  const temp = Math.round(current.main.temp);
  const description = current.weather[0].description;
  const dailyForecast = getDailyForecast(forecast.list, forecast.city.timezone);

  const forecastHTML = dailyForecast
    .map(({ entry, date }) => {
      const label = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const dayTemp = Math.round(entry.main.temp);
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

// Fisher-Yates shuffle (unbiased)
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Gold (3) and Silver (2) members only, shuffled, showing 2 or 3 at random
function pickSpotlights(members) {
  const eligible = members.filter(
    (member) => member.membership === 2 || member.membership === 3
  );
  const count = Math.random() < 0.5 ? 2 : 3;
  return shuffle(eligible).slice(0, count);
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
          <h3>${member.name}</h3>
          <span class="badge" data-level="${member.membership}">${membershipLabels[member.membership]}</span>
        </div>
      </div>
      <div class="card-body">
        <p>${member.address}</p>
        <p>${member.phone}</p>
      </div>
      <div class="card-actions">
        <a href="${member.website}" target="_blank" rel="noopener" aria-label="Visit ${member.name} website">Visit website</a>
        <a href="tel:${member.phone.replace(/[^\d+]/g, "")}" aria-label="Call ${member.name}">Call</a>
      </div>
    `;

    spotlightsDisplay.appendChild(card);
  });
}

getSpotlights();