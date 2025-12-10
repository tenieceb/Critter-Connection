
export function renderSpeciesDetails(species, status) {
  // Common + scientific name
  document.getElementById("species-common-name").textContent =
    species.name || "Unknown Species";

  document.getElementById("species-scientific-name").textContent =
    species.taxonomy?.scientific_name || "N/A";

  // Image
  const imgEl = document.getElementById("species-image");
  imgEl.src = species.image_link || "img/fallback-image.png";
  imgEl.alt = species.name;

  // Conservation status (from GBIF/IUCN)
  document.getElementById("species-status").textContent =
    status?.iucnRedListCategory || "Not Evaluated";

  // Habitat & Diet block
  document.getElementById("habitat-diet").textContent = `
    Habitat: ${species.characteristics?.habitat ?? "Unknown"}  
    | Diet: ${species.characteristics?.diet ?? "Unknown"}
  `.trim();

  // Lifespan & Facts block
  document.getElementById("lifespan-facts").textContent = species.characteristics?.lifespan
    ? `Lifespan: ${species.characteristics.lifespan}`
    : "No data available";

  // Conservation text (fallback from characteristics or status)
  document.getElementById("conservation-efforts").textContent =
    species.characteristics?.conservation_status ||
    status?.iucnRedListCategory ||
    "No conservation data available.";
}


export async function renderSpeciesPage() {
  const speciesName = getQueryParam('name');
  if (!speciesName) {
    document.body.innerHTML = "<p>No species specified.</p>";
    return;
  }

  const animals = await loadLocalAnimals();

  // Find animal by name (case-insensitive)
  const animal = animals.find(a => a.name.toLowerCase() === speciesName.toLowerCase());

  if (!animal) {
    document.body.innerHTML = `<p>Species "${speciesName}" not found.</p>`;
    return;
  }

  // Render details into your page elements
  document.getElementById('species-common-name').textContent = animal.name;
  document.getElementById('species-scientific-name').textContent = animal.scientific_name || 'N/A';
  document.querySelector('.species-image img').src = animal.image_link || 'img/fallback-image.png';
  document.querySelector('.species-image img').alt = animal.name;

  document.getElementById('species-status').textContent = animal.status;
  // For habitat, diet, lifespan etc, if your JSON doesn’t have them, you can leave empty or "Unknown"
  document.getElementById('habitat-diet').textContent = animal.habitat || "Unknown habitat and diet info.";
  document.getElementById('lifespan-facts').textContent = animal.lifespan || "Unknown lifespan and facts.";
  document.getElementById('conservation-efforts').textContent = animal.conservation_efforts || "No conservation info available.";

  // TODO: Load and render occurrence map and similar animals as needed
}

window.addEventListener('DOMContentLoaded', renderSpeciesPage);
