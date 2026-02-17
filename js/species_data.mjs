// species_data.mjs

const GBIF_TAXON_URL = "https://api.gbif.org/v1/species";
const GBIF_OCCURRENCE_URL = (id) =>
  
  `https://api.gbif.org/v1/occurrence/search?taxonKey=${id}&limit=100`;

/* --------------------------
   GBIF: Match Species
-------------------------- */
export async function matchGBIFSpeciesName(name) {
  try {
    const res = await fetch(`${GBIF_TAXON_URL}/match?name=${encodeURIComponent(name)}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data.usageKey || null;
  } catch (err) {
    console.error("GBIF match error:", err);
    return null;
  }
}

/* --------------------------
   GBIF: Occurrence Map Data
-------------------------- */
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