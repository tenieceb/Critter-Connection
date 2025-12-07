import { loadLocalAnimals, getSpotlightAnimal, filterAnimals } from './animals.js';

document.addEventListener('DOMContentLoaded', async () => {
  const animals = await loadLocalAnimals();

  const spotlightContainer = document.getElementById('spotlight-card');
  const animalGrid = document.getElementById('animal-grid');

  // Render spotlight animal
  const spotlightAnimal = getSpotlightAnimal(animals);
  if (spotlightAnimal) {
    spotlightContainer.innerHTML = `
      <h3>${spotlightAnimal.name}</h3>
      <img src="${spotlightAnimal.image_link}" alt="${spotlightAnimal.name}" style="max-width: 100%; height: auto;">
      <p><strong>Status:</strong> ${spotlightAnimal.status}</p>
      <p><strong>Type:</strong> ${spotlightAnimal.type}</p>
    `;
  } else {
    spotlightContainer.textContent = 'No spotlight animal available.';
  }

  // Render all animals initially
  renderAnimals(animals, animalGrid);

  // Set up filter radio buttons
  const filterStatusRadios = document.querySelectorAll('input[name="status"]');
  const filterTypeRadios = document.querySelectorAll('input[name="type"]');

  function applyFilters() {
    // Get selected values or empty string if none
    const selectedStatus = [...filterStatusRadios].find(r => r.checked)?.value || '';
    const selectedType = [...filterTypeRadios].find(r => r.checked)?.value || '';

    // Filter animals
    const filtered = filterAnimals(animals, { status: selectedStatus, type: selectedType });

    // Render filtered animals
    renderAnimals(filtered, animalGrid);
  }

  // Attach change event listeners to filters
  filterStatusRadios.forEach(radio => radio.addEventListener('change', applyFilters));
  filterTypeRadios.forEach(radio => radio.addEventListener('change', applyFilters));
});

/**
 * Render animal cards into the container
 * @param {Array} animals 
 * @param {HTMLElement} container 
 */
function renderAnimals(animals, container) {
  if (!animals.length) {
    container.innerHTML = '<p>No animals found.</p>';
    return;
  }

  container.innerHTML = animals.map(animal => `
    <div class="animal-card">
      <h4>${animal.name}</h4>
      <img src="${animal.image_link}" alt="${animal.name}" style="max-width: 100%; height: auto;">
      <p><strong>Status:</strong> ${animal.status}</p>
      <p><strong>Type:</strong> ${animal.type}</p>
    </div>
  `).join('');
}
