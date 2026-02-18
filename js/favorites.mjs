import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const favKey = "favoriteCritters";

function renderFavorites() {
  const favorites = getLocalStorage(favKey) || [];
  const container = document.querySelector("#animal-grid");

  if (!favorites.length) {
    container.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  let html = "";
  favorites.forEach(animal => {
    html += `
      <div class="details-left animal-card">
        <h2>${animal.name}</h2>
        <p class="species-scientific-name">${animal.scientific_name || ""}</p>
        <div class="species-header">
          <div class="species-image">
            <img src="${animal.image_link}" alt="${animal.name}" width="400"/>
          </div>
          <div class="description">${animal.description || "No description available."}</div>
        </div>
        <div class="info-block">
          <h4>Habitat</h4><div>${animal.information?.habitat || "Unknown"}</div>
          <h4>Diet</h4><div>${animal.information?.diet || "Unknown"}</div>
          <h4>Behavior</h4><div>${animal.information?.behavior || "Unknown"}</div>
          <h4>Conservation Status</h4><div>${animal.status || "Unknown"}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

renderFavorites();
