import { loadLocalAnimals, getSpotlightAnimal, filterAnimals } from './animals.js';
import {loadHeaderFooter } from './utils.js';
import { renderSpeciesPage } from './species_details.js';

loadHeaderFooter();
document.addEventListener('DOMContentLoaded', async () => {
  const animals = await loadLocalAnimals();

  const spotlightContainer = document.getElementById('spotlight-card');
  const animalGrid = document.getElementById('animal-grid');

  // Render spotlight animal
  const spotlightAnimal = getSpotlightAnimal(animals);
  if (spotlightAnimal) {
    spotlightContainer.innerHTML = `
      <h3>${spotlightAnimal.name}</h3>
      <img src="${spotlightAnimal.image_link || 'img/fallback-image.png'}" alt="${spotlightAnimal.name}" style="max-width: 400px; height: auto;">
      <p><strong>Status:</strong> ${spotlightAnimal.status}</p>
      <p><strong>Type:</strong> ${spotlightAnimal.type}</p>
    `;
  } else {
    spotlightContainer.textContent = 'No spotlight animal available.';
  }

  // Initial render of all animals
  renderAnimals(animals, animalGrid);

  // Grab all checkbox inputs
  const statusCheckboxes = document.querySelectorAll('input[name="status"]');
  const typeCheckboxes = document.querySelectorAll('input[name="type"]');
  const sortRadio = document.querySelectorAll('input[name="sort"]');

  // Listen for changes on all filters and sort checkboxes
function applyFiltersAndSort() {
  const selectedStatuses = [...statusCheckboxes].filter(cb => cb.checked).map(cb => cb.value.toLowerCase());
  const selectedTypes = [...typeCheckboxes].filter(cb => cb.checked).map(cb => cb.value.toLowerCase());
  const selectedSort = document.querySelector('input[name="sort"]:checked')?.value || '';

  console.log('Selected sort:', selectedSort);

  let filtered = filterAnimals(animals, { statuses: selectedStatuses, types: selectedTypes });

  if (selectedSort === 'alpha-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedSort === 'alpha-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderAnimals(filtered, animalGrid);
}

  // Add event listeners
  [...statusCheckboxes, ...typeCheckboxes, ...sortRadio].forEach(cb => {
    cb.addEventListener('change', applyFiltersAndSort);
  });
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    clearFiltersBtn.addEventListener('click', () => {
      // Uncheck all status checkboxes
      statusCheckboxes.forEach(cb => cb.checked = false);
      // Uncheck all type checkboxes
      typeCheckboxes.forEach(cb => cb.checked = false);
      // Uncheck all sort radios
      sortRadios.forEach(rb => rb.checked = false);

      // Trigger filter update with all cleared
      applyFiltersAndSort();
    });

  loadHeaderFooter();
});

/**
 * Render animals cards
 * @param {Array} animals 
 * @param {HTMLElement} container 
 */
function renderAnimals(animals, container) {
  if (!animals.length) {
    container.innerHTML = '<p>No animals found.</p>';
    return;
  }

  const cardsHTML = animals.map(animal => `
    <div class="animal-card" data-name="${animal.name}" style="cursor:pointer;">
      <h4>${animal.name}</h4>
      <img src="${animal.image_link || 'img/fallback-image.png'}"
           alt="${animal.name}"
           style="max-width: 400px; height: auto;">
      <p><strong>Status:</strong> ${animal.status}</p>
      <p><strong>Type:</strong> ${animal.type}</p>
    </div>
  `).join('');

  container.innerHTML = cardsHTML;

  // Add click listeners to cards
  container.querySelectorAll('.animal-card').forEach(card => {
    card.addEventListener('click', () => {
    const animalName = card.getAttribute('data-name');
    window.location.href = `species.html?name=${encodeURIComponent(animalName)}`;
    });
  });
}

