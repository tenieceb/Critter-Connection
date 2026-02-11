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