import { loadLocalAnimals, getSpotlightAnimal, filterAnimals } from './animals.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

document.addEventListener('DOMContentLoaded', async () => {
  const animals = await loadLocalAnimals();

  const spotlightContainer = document.getElementById('spotlight-card');
  const animalGrid = document.getElementById('animal-grid');

  /* -------------------------
     RENDER SPOTLIGHT ANIMAL
  -------------------------- */
  if (spotlightContainer) {
    const spotlightAnimal = getSpotlightAnimal(animals);
    if (spotlightAnimal) {
      spotlightContainer.innerHTML = `
        <h3>${spotlightAnimal.name}</h3>
        <img src="${spotlightAnimal.image_link || 'img/fallback-image.png'}" 
             alt="${spotlightAnimal.name}" width="300">
        <p><strong>Status:</strong> ${spotlightAnimal.status}</p>
        <p><strong>Type:</strong> ${spotlightAnimal.type}</p>
      `;
    } else {
      spotlightContainer.textContent = 'No spotlight animal available.';
    }
  }

  /* -------------------------
     INITIAL ANIMAL RENDER
  -------------------------- */
  if (animalGrid) {
    renderAnimals(animals, animalGrid);
  }

  /* -------------------------
     FILTERS + SORT SETUP
  -------------------------- */
  const statusCheckboxes = document.querySelectorAll('input[name="status"]');
  const typeCheckboxes = document.querySelectorAll('input[name="type"]');
  const sortRadios = document.querySelectorAll('input[name="sort"]');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');

  if (
    statusCheckboxes.length > 0 &&
    typeCheckboxes.length > 0 &&
    sortRadios.length > 0 &&
    clearFiltersBtn
  ) {
    function applyFiltersAndSort() {
      const selectedStatuses = [...statusCheckboxes]
        .filter(cb => cb.checked)
        .map(cb => cb.value.toLowerCase());

      const selectedTypes = [...typeCheckboxes]
        .filter(cb => cb.checked)
        .map(cb => cb.value.toLowerCase());

      const selectedSort =
        document.querySelector('input[name="sort"]:checked')?.value || '';

      let filtered = filterAnimals(animals, {
        statuses: selectedStatuses,
        types: selectedTypes
      });

      // Sorting
      if (selectedSort === 'alpha-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (selectedSort === 'alpha-desc') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }

      renderAnimals(filtered, animalGrid);
    }

    // Event listeners for ALL filters
    [...statusCheckboxes, ...typeCheckboxes, ...sortRadios].forEach(input => {
      input.addEventListener('change', applyFiltersAndSort);
    });

    /* -------------------------
       CLEAR FILTERS BUTTON
    -------------------------- */
    clearFiltersBtn.addEventListener('click', () => {
      statusCheckboxes.forEach(cb => (cb.checked = false));
      typeCheckboxes.forEach(cb => (cb.checked = false));
      sortRadios.forEach(rb => (rb.checked = false));

      applyFiltersAndSort();
    });
  }
});

/* -------------------------
   RENDER ANIMAL CARDS
-------------------------- */
function renderAnimals(animals, container) {
  if (!animals.length) {
    container.innerHTML = '<p>No animals found.</p>';
    return;
  }

  container.innerHTML = animals
    .map(
      animal => `
      <div class="animal-card" data-name="${animal.name}" style="cursor:pointer;">
        <h4>${animal.name}</h4>
        <img src="${animal.image_link || 'img/fallback-image.png'}" 
             alt="${animal.name}" width="200">
        <p><strong>Status:</strong> ${animal.status}</p>
        <p><strong>Type:</strong> ${animal.type}</p>
      </div>
    `
    )
    .join('');

  // Click → species.html?name=
  container.querySelectorAll('.animal-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      window.location.href = `species.html?name=${encodeURIComponent(name)}`;
    });
  });
}