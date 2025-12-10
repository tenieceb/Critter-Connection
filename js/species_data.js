const NINJA_KEY = "V2BVr+n6Z4LYeOAUq3g0Kw==p7nCK3PSKpMxvwQs";
const NINJA_URL = "https://api.api-ninjas.com/v1/animals";
const GBIF_TAXON_URL = "https://api.gbif.org/v1/species";
const GBIF_IUCN_URL = (id) => `https://api.gbif.org/v1/species/${id}/iucnRedListCategory`;
const GBIF_OCCURRENCE_URL = (id) => `https://api.gbif.org/v1/occurrence/search?taxonKey=${id}&limit=100`;

/**
 * Fetch species basic data from API Ninjas
 * @param {string} name - species common name
 * @returns {Promise<object[]>} - array of species data
 */
export async function getSpeciesData(name) {
  try {
    const res = await fetch(`${NINJA_URL}?name=${encodeURIComponent(name)}`, {
      headers: { "X-Api-Key": NINJA_KEY }
    });

    if (!res.ok) throw new Error("Ninjas fetch failed");
    return await res.json();
  } catch (err) {
    console.error("Ninjas API error:", err);
    return [];
  }
}

/**
 * Fetch GBIF species match (taxon ID) by scientific name
 * @param {string} scientificName
 * @returns {Promise<number|null>} - GBIF usageKey or null
 */
export async function matchGBIFScientificName(scientificName) {
  try {
    const res = await fetch(`${GBIF_TAXON_URL}/match?name=${encodeURIComponent(scientificName)}`);
    const data = await res.json();
    return data.usageKey || null;
  } catch (err) {
    console.error("GBIF match error:", err);
    return null;
  }
}

/**
 * Fetch IUCN conservation status from GBIF
 * @param {number} gbifID - usageKey
 * @returns {Promise<object|null>} - IUCN status data or null
 */
export async function getGBIFConservationStatus(gbifID) {
  try {
    const res = await fetch(GBIF_IUCN_URL(gbifID));
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("GBIF IUCN fetch error:", err);
    return null;
  }
}

/**
 * Fetch occurrence data from GBIF for mapping
 * @param {number} gbifID - usageKey
 * @returns {Promise<object|null>} - occurrence data or null
 */
export async function getGBIFOccurrenceMapData(gbifID) {
  try {
    const res = await fetch(GBIF_OCCURRENCE_URL(gbifID));
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("GBIF occurrence fetch error:", err);
    return null;
  }
}
