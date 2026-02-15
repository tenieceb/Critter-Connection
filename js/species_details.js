// species_details.js
import { loadHeaderFooter, getQueryParam } from './utils.mjs';
import { matchGBIFSpeciesName, getGBIFOccurrenceMapData } from './species_data.mjs';
import { loadLocalAnimals } from './animals.mjs';

loadHeaderFooter();

document.addEventListener('DOMContentLoaded', async () => {
  const speciesNameParam = getQueryParam("name");
  if (!speciesNameParam) return;

  const allAnimals = await loadLocalAnimals();

  // Find the species object that matches the query parameter
  const species = allAnimals.find(
    a => a.name.toLowerCase() === speciesNameParam.toLowerCase()
  );

  if (!species) {
    console.warn("Species not found:", speciesNameParam);
    return;
  }

  // --------------------------
  // Populate text info
  // --------------------------
  document.getElementById('description').textContent = species.description || "No description available.";
  document.getElementById('species-common-name').textContent = species.name;
  document.getElementById('species-scientific-name').textContent = species.scientific_name || "";
  document.getElementById('habitat').textContent = species.information?.habitat || "Unknown Habitat";
  document.getElementById('diet').textContent = species.information?.diet || "Unknown Diet";
  document.getElementById('behavior').textContent = species.information?.behavior || "Unknown Behavior";
  document.getElementById('conservation').textContent = species.status || "Unknown Conservation Status";
  document.getElementById('fun-facts-list').innerHTML =
    (species.facts || []).map(f => `<li>${f}</li>`).join('');

  // --------------------------
  // Populate image
  // --------------------------
  const imageEl = document.getElementById('species-image');
  if (species.image_link) {
    imageEl.src = species.image_link;
    imageEl.alt = species.name;
  } else {
    imageEl.src = 'img/fallback-image.png';
    imageEl.alt = 'Fallback Image';
  }

  // --------------------------
  // GBIF Occurrence Map
  // --------------------------
  const speciesMapEl = document.getElementById("species-map");

  try {
    // Use scientific name for GBIF match
    const gbifID = await matchGBIFSpeciesName(species.scientific_name || species.name);

    if (gbifID) {
      const occurrenceData = await getGBIFOccurrenceMapData(gbifID);
      renderMap(occurrenceData, speciesMapEl);
    } else {
      speciesMapEl.textContent = "No GBIF occurrence data found.";
    }
  } catch (err) {
    console.error("Error loading GBIF map:", err);
    speciesMapEl.textContent = "Error loading map.";
  }
});

/* --------------------------
   Render Leaflet Map
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

  const markers = [];

  occurrenceData.results.forEach(record => {
    const lat = parseFloat(record.decimalLatitude);
    const lon = parseFloat(record.decimalLongitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      markers.push([lat, lon]);
      L.circleMarker([lat, lon], { radius: 4, color: 'red' }).addTo(map);
    }
  });

  if (markers.length > 0) {
    map.fitBounds(markers);
  } else {
    mapContainer.textContent = "No valid occurrence coordinates.";
  }
}
