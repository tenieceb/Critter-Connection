

export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate("./partials/header.html");
    const footerTemplate = await loadTemplate("./partials/footer.html");

    const headerElement = document.querySelector("#dy-header");
    const footerElement = document.querySelector("#dy-footer");

    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
    } else {
      console.warn("Header element '#dy-header' not found");
    } 

    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    } else {
      console.warn("Footer element '#dy-footer' not found");
    }
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export function renderWithTemplate(template, parentElement, { data = null, callback } = {}) {
  parentElement.innerHTML = template;
  if (callback) callback(data);
}

export function qs(selector) {
  return document.querySelector(selector);
}

export function createEl(tag, className) {
  const el = document.createElement(tag);
  if (className) el.classList.add(className);
  return el;
}

export function showError(msg) {
  alert(msg);
}

export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/* --------------------------
   Recently Viewed Critters Helpers
-------------------------- */

/**
 * Get recently viewed critters from localStorage
 * @returns {Array<string>} Array of species names
 */
export function getRecentlyViewed() {
  const storageKey = 'recentlyViewedCritters';
  return JSON.parse(localStorage.getItem(storageKey)) || [];
}

/**
 * Add a species to recently viewed list
 * Keeps only the last `maxItems` entries
 * @param {string} speciesName 
 * @param {number} maxItems 
 */
export function addRecentlyViewed(speciesName, maxItems = 3) {
  const storageKey = 'recentlyViewedCritters';
  let list = getRecentlyViewed();

  // Remove duplicates
  list = list.filter(name => name.toLowerCase() !== speciesName.toLowerCase());

  // Add to front
  list.unshift(speciesName);

  // Keep only last maxItems
  if (list.length > maxItems) list = list.slice(0, maxItems);

  setLocalStorage(storageKey, list);
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
