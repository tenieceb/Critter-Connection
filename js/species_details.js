// species_details.js
import { loadHeaderFooter, getQueryParam, getLocalStorage, setLocalStorage  } from './utils.mjs';
import { matchGBIFSpeciesName, getGBIFOccurrenceMapData } from './species_data.mjs';
import { loadLocalAnimals} from './animals.mjs';

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

  mapContainer.style.height = mapContainer.style.height || "350px";

  const map = L.map(mapContainer.id).setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];

  occurrenceData.results.forEach(record => {
    const lat = parseFloat(record.decimalLatitude);
    const lon = parseFloat(record.decimalLongitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      markers.push([lat, lon]);

      const marker = L.circleMarker([lat, lon], { radius: 4, color: 'red' }).addTo(map);

      // Click marker to show weather
      marker.on('click', async () => {
        try {
          const YOUR_API_KEY = '3fb62b745deb495897f5a82ccb7eee1d'; // replace with your key
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${YOUR_API_KEY}&units=metric`
          );
          const weatherData = await res.json();

          let celsius = weatherData.main.temp;
          let fahrenheit = (celsius * 9/5 + 32).toFixed(1);
          let unit = 'F';
          let temp = fahrenheit;

          // HTML for popup with toggle button
          const popupContent = document.createElement('div');
          const weatherHTML = document.createElement('p');
          weatherHTML.innerHTML = `<strong>Current Weather:</strong> ${weatherData.weather[0].description}<br>Temp: <span id="temp">${temp}</span>°${unit}`;
          const toggleBtn = document.createElement('button');
          toggleBtn.textContent = 'Toggle °C/°F';
          toggleBtn.style.marginTop = '5px';
          toggleBtn.addEventListener('click', () => {
            if (unit === 'C') {
              temp = fahrenheit;
              unit = 'F';
            } else {
              temp = celsius.toFixed(1);
              unit = 'C';
            }
            weatherHTML.innerHTML = `<strong>Current Weather:</strong> ${weatherData.weather[0].description}<br>Temp: <span id="temp">${temp}</span>°${unit}`;
          });

          popupContent.appendChild(weatherHTML);
          popupContent.appendChild(toggleBtn);

          marker.bindPopup(popupContent).openPopup();
        } catch (err) {
          console.error("Weather fetch error:", err);
          marker.bindPopup("Unable to load weather data.").openPopup();
        }
      });
    }
  });

  if (markers.length > 0) {
    map.fitBounds(markers);
    setTimeout(() => map.invalidateSize(), 100);
  } else {
    mapContainer.textContent = "No valid occurrence coordinates.";
  }
}

// Favorite button logic
const favKey = "favoriteCritters";

function saveFavorite(speciesObj) {
  let favorites = getLocalStorage(favKey) || [];

  // Remove duplicates by name
  favorites = favorites.filter(fav => fav.name !== speciesObj.name);

  favorites.push(speciesObj);
  setLocalStorage(favKey, favorites);
}

// Hook up favorite button
const favoriteButton = document.getElementById("favoritebutton");
favoriteButton.addEventListener("click", () => {
  const speciesObj = {
    name: document.getElementById("species-common-name").textContent,
    scientific_name: document.getElementById("species-scientific-name").textContent,
    image_link: document.getElementById("species-image").src,
    description: document.getElementById("description").textContent,
    information: {
      habitat: document.getElementById("habitat").textContent,
      diet: document.getElementById("diet").textContent,
      behavior: document.getElementById("behavior").textContent
    },
    status: document.getElementById("conservation").textContent,
    facts: Array.from(document.querySelectorAll("#fun-facts-list li")).map(li => li.textContent)
  };

  saveFavorite(speciesObj);

});
