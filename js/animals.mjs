/**
 * Load animals data from local JSON file
 * @returns {Promise<Array>} Array of animal objects
 */
export async function loadLocalAnimals() {
  try {
    const res = await fetch('data/animals.json');
    if (!res.ok) throw new Error('Failed to load animals JSON');
    const animals = await res.json();
    return animals;
  } catch (err) {
    console.error('Error loading local animals:', err);
    return [];
  }
}

/**
 * Get a random endangered or vulnerable animal for spotlight
 * @param {Array} animals 
 * @returns {Object|null} Random spotlight animal or null if none found
 */
export function getSpotlightAnimal(animals) {
  const filtered = animals.filter(a =>
    a.status.toLowerCase().includes('endangered') ||
    a.status.toLowerCase().includes('vulnerable') ||
    a.status.toLowerCase().includes('critically endangered')
  );

  if (filtered.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * Filter animals by multiple conservation statuses and types
 * @param {Array} animals
 * @param {Object} filters
 * @param {Array<string>} [filters.statuses] - Array of statuses to filter by (e.g. ["endangered", "vulnerable"])
 * @param {Array<string>} [filters.types] - Array of types to filter by (e.g. ["mammal", "bird"])
 * @returns {Array} Filtered animal list
 */
export function filterAnimals(animals, { statuses = [], types = [] } = {}) {
  return animals.filter(animal => {
    const statusMatch = statuses.length === 0 || statuses.includes(animal.status.toLowerCase());
    const typeMatch = types.length === 0 || types.includes(animal.type.toLowerCase());
    return statusMatch && typeMatch;
  });
}