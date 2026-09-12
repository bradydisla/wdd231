/* =========================================================
   Camara de Comercio de Santiago — directory.html behavior
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

// ---------- member directory ----------
const membersDisplay = document.querySelector("#members-display");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

const membershipLabels = {
  1: "Member",
  2: "Silver Member",
  3: "Gold Member",
};

async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    membersDisplay.innerHTML = `<p class="members-status">Sorry, the member directory could not be loaded right now.</p>`;
    console.error("Error fetching member data:", error);
  }
}

function displayMembers(members) {
  membersDisplay.innerHTML = "";

  members.forEach((member) => {
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
        <p class="category">${member.category} &middot; est. ${member.founded}</p>
        <p>${member.description}</p>
        <p>${member.address}</p>
        <p>${member.phone}</p>
      </div>
      <div class="card-actions">
        <a href="${member.website}" target="_blank" rel="noopener">Visit website</a>
        <a href="tel:${member.phone.replace(/[^\d+]/g, "")}">Call</a>
      </div>
    `;

    membersDisplay.appendChild(card);
  });
}

function setView(view) {
  membersDisplay.classList.remove("grid", "list");
  membersDisplay.classList.add(view);
  gridButton.setAttribute("aria-pressed", view === "grid");
  listButton.setAttribute("aria-pressed", view === "list");
}

gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));

setView("grid");
getMembers();