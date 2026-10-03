import { discoverItems } from "../data/discover.mjs";

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
// Discover gallery
// =========================================================

const gallery = document.querySelector("#discover-gallery");
const PLACEHOLDER_IMG = "images/placeholder-discover.svg";

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Swap to the placeholder once if an image fails to load
function addImageFallback(root) {
  root.querySelectorAll("img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.src = PLACEHOLDER_IMG;
      },
      { once: true }
    );
  });
}

function createCard(item, index) {
  const slug = slugify(item.name);
  const modalId = `modal-${slug}-${index}`;
  const titleId = `title-${slug}-${index}`;

  const card = document.createElement("section");
  card.classList.add("discover-card");

  card.innerHTML = `
    <h2>${item.name}</h2>
    <figure>
      <img
        src="images/${item.image}"
        alt="${item.name}"
        width="300"
        height="200"
        loading="lazy"
      />
    </figure>
    <address>${item.address}</address>
    <p>${item.description}</p>
    <button type="button" class="learn-more" data-modal-target="${modalId}">Learn More</button>
  `;

  const dialog = document.createElement("dialog");
  dialog.classList.add("tier-modal");
  dialog.id = modalId;
  dialog.setAttribute("aria-labelledby", titleId);
  dialog.innerHTML = `
    <div class="modal-inner">
      <h2 id="${titleId}">${item.name}</h2>
      <figure>
        <img
          src="images/${item.image}"
          alt="${item.name}"
          width="300"
          height="200"
          loading="lazy"
        />
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ", " + item.address)}"
          target="_blank"
          rel="noopener"
        >View on Google Maps</a>
      </p>
      <button type="button" class="modal-close" autofocus>Close</button>
    </div>
  `;

  addImageFallback(card);
  addImageFallback(dialog);

  return { card, dialog };
}

function displayDiscoverItems(items) {
  gallery.innerHTML = "";
  items.forEach((item, index) => {
    const { card, dialog } = createCard(item, index);
    gallery.appendChild(card);
    document.body.appendChild(dialog);
  });

  wireUpModals();
}

function wireUpModals() {
  document.querySelectorAll(".learn-more").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.modalTarget);
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });
  });

  document.querySelectorAll("dialog.tier-modal .modal-close").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog");
      if (dialog) dialog.close();
    });
  });

  // Close when the user clicks outside the modal content (on the backdrop area)
  document.querySelectorAll("dialog.tier-modal").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      const inBounds =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inBounds) dialog.close();
    });
  });
}

displayDiscoverItems(discoverItems);

// =========================================================
// Last-visit message (localStorage)
// =========================================================

const visitMessageBox = document.querySelector("#visit-message");
const visitMessageText = document.querySelector("#visit-message-text");
const visitMessageClose = document.querySelector("#visit-message-close");

function readLastVisit() {
  try {
    return localStorage.getItem("lastVisit");
  } catch {
    return null; // storage blocked (e.g. private mode)
  }
}

function saveLastVisit(timestamp) {
  try {
    localStorage.setItem("lastVisit", timestamp.toString());
  } catch {
    // ignore: the message simply shows the first-visit text next time
  }
}

function getVisitMessage(now, lastVisit) {
  if (!lastVisit) {
    return "Welcome! Let us know if you have any questions.";
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = (now - Number(lastVisit)) / msPerDay;

  if (diffDays < 1) {
    return "Back so soon! Awesome!";
  }

  const days = Math.floor(diffDays);
  const dayWord = days === 1 ? "day" : "days";
  return `You last visited ${days} ${dayWord} ago.`;
}

const now = Date.now();
visitMessageText.textContent = getVisitMessage(now, readLastVisit());
visitMessageBox.hidden = false;
saveLastVisit(now);

visitMessageClose.addEventListener("click", () => {
  visitMessageBox.hidden = true;
});