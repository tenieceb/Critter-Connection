// species_data.mjs

const GBIF_TAXON_URL = "https://api.gbif.org/v1/species";
const GBIF_IUCN_URL = (id) => `https://api.gbif.org/v1/species/${id}/iucnRedListCategory`;
const GBIF_OCCURRENCE_URL = (id) =>
  `https://api.gbif.org/v1/occurrence/search?taxonKey=${id}&limit=100`;

/* --------------------------
   Wikipedia Summary
-------------------------- */
export async function fetchWikiSummary(speciesName) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(speciesName)}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();

    // Return extract + pageId for image
    return {
      extract: data.extract || "",
      pageId: data.pageid || null,
    };
  } catch (err) {
    console.error("Wikipedia summary fetch error:", err);
    return null;
  }
}

/* --------------------------
   Wikipedia Image
-------------------------- */
export async function fetchWikiImage(pageId) {
  if (!pageId) return null;
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=pageimages&pageids=${pageId}&format=json&pithumbsize=500`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const page = data.query.pages[String(pageId)];
    return page?.thumbnail?.source || null;
  } catch (err) {
    console.error("Wikipedia image fetch error:", err);
    return null;
  }
}

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
   GBIF: Conservation Status
-------------------------- */
export async function getGBIFConservationStatus(gbifID) {
  try {
    const res = await fetch(GBIF_IUCN_URL(gbifID));
    if (!res.ok) return null;
    const data = await res.json();
    return data; // raw object, category accessible in species_details.js
  } catch (err) {
    console.error("GBIF IUCN fetch error:", err);
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
