export async function loadLocalAnimals() {
  try {
    const res = await fetch('data/animals.json');
    const animals = await res.json();
    return animals;
  } catch (err) {
    console.error('Error loading local animals:', err);
    return [];
  }
}

// Spotlight: pick a random endangered or vulnerable animal
export function getSpotlightAnimal(animals) {
  const filtered = animals.filter(a => 
    a.status.toLowerCase().includes('endangered') || 
    a.status.toLowerCase().includes('vulnerable')
  );
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

// Filter animals by conservation status and type
export function filterAnimals(animals, {status = '', type = ''} = {}) {
  return animals.filter(a => {
    const statusMatch = status ? a.status.toLowerCase() === status.toLowerCase() : true;
    const typeMatch = type ? a.type.toLowerCase() === type.toLowerCase() : true;
    return statusMatch && typeMatch;
  });
}
