// species_details.js
import { loadHeaderFooter, getQueryParam } from './utils.mjs';
import {
  fetchWikiSummary,
  fetchWikiImage,
  matchGBIFSpeciesName,
  getGBIFConservationStatus,
  getGBIFOccurrenceMapData
} from './species_data.mjs';


loadHeaderFooter();

document.addEventListener('DOMContentLoaded', async () => {
  const speciesName = getQueryParam("name");
  if (!speciesName) return;

  // DOM Elements
  const funFactsListEl = document.getElementById("fun-facts-list");
  const conservationEl = document.getElementById("conservation");
  const habitatEl = document.getElementById("habitat");
  const dietEl = document.getElementById("diet");
  const behaviorEl = document.getElementById("behavior");
  const speciesImageEl = document.getElementById("species-image");
  const speciesMapEl = document.getElementById("species-map");
  const similarListEl = document.getElementById("similar-list");
  const speciesCommonNameEl = document.getElementById("species-common-name");
  const speciesScientificNameEl = document.getElementById("species-scientific-name");
  const upvoteBtn = document.querySelector(".upvote-button");

  speciesCommonNameEl.textContent = speciesName;

  try {
    // --------------------------
    // 1️⃣ Wikipedia Summary + Image
    // --------------------------
    const wikiData = await fetchWikiSummary(speciesName);
    if (wikiData?.extract) {
      speciesInfoEl.textContent = wikiData.extract;
    } else {
      speciesInfoEl.textContent = "No summary available.";
    }

    if (wikiData?.pageId) {
      const imageUrl = await fetchWikiImage(wikiData.pageId);
      if (imageUrl) speciesImageEl.src = imageUrl;
    }

    // --------------------------
    // 2️⃣ GBIF: Match Species → Conservation + Map
    // --------------------------
    const gbifID = await matchGBIFSpeciesName(speciesName);
    if (gbifID) {
      const iucnData = await getGBIFConservationStatus(gbifID);
      conservationEl.textContent = iucnData?.category || "Not available";

      const occurrenceData = await getGBIFOccurrenceMapData(gbifID);
      renderMap(occurrenceData, speciesMapEl);
    } else {
      conservationEl.textContent = "Not available";
      speciesMapEl.textContent = "No map data.";
    }

    // --------------------------
    // 3️⃣ Similar Critters (placeholder)
    // --------------------------
    renderSimilarCritters(speciesName, similarListEl);

    // --------------------------
    // 4️⃣ Upvote System
    // --------------------------
    setupUpvote(speciesName, upvoteBtn);

  } catch (err) {
    console.error("Error loading species details:", err);
  }
});

/* --------------------------
   MAP RENDERING
-------------------------- */
function renderMap(occurrenceData, mapContainer) {
  if (!occurrenceData?.results || occurrenceData.results.length === 0) {
    mapContainer.textContent = "No occurrence data available.";
    return;
  }

  const map = L.map(mapContainer).setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  occurrenceData.results.forEach(record => {
    if (record.decimalLatitude && record.decimalLongitude) {
      L.circleMarker([record.decimalLatitude, record.decimalLongitude], {
        radius: 4,
        color: 'red'
      }).addTo(map);
    }
  });
}

/* --------------------------
   SIMILAR CRITTERS
-------------------------- */
function renderSimilarCritters(speciesName, container) {
  container.innerHTML = `<p>Similar critters for "${speciesName}" will go here.</p>`;
}

/* --------------------------
   UPVOTE SYSTEM
-------------------------- */
function setupUpvote(speciesName, button) {
  const storageKey = `upvotes_${speciesName}`;
  let currentUpvotes = parseInt(localStorage.getItem(storageKey)) || 0;

  button.textContent = `❤️ Up Vote this Animal! (${currentUpvotes})`;

  button.addEventListener('click', () => {
    currentUpvotes += 1;
    localStorage.setItem(storageKey, currentUpvotes);
    button.textContent = `❤️ Up Vote this Animal! (${currentUpvotes})`;
  });
}
