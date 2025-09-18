/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: convert iframes (except images) to links
  function convertIframesToLinks(el) {
    el.querySelectorAll('iframe[src]').forEach(iframe => {
      // Only convert if not inside a <picture> or <img>
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      iframe.replaceWith(link);
    });
  }

  // 1. Header row
  const headerRow = ['Columns (columns7)'];

  // 2. Find the main content wrappers
  const wrappers = Array.from(element.querySelectorAll(':scope > div'));

  // Find the form-wrapper
  const formWrapper = wrappers.find(div => div.classList.contains('form-wrapper'));
  // Find the form block (actual <form>)
  const formBlock = formWrapper ? formWrapper.querySelector('.form.block') : null;

  // Find the image/content wrapper (default-content-wrapper)
  const imageWrapper = wrappers.find(div => div.classList.contains('default-content-wrapper'));

  // --- Extract all text content from form ---
  // We'll collect labels, placeholders, and any visible text
  const formContent = [];
  if (formBlock) {
    // Clone the form block so we don't mutate original
    const formClone = formBlock.cloneNode(true);
    convertIframesToLinks(formClone);
    formContent.push(formClone);
  }

  // --- Extract all text content from image/content wrapper ---
  const imageContent = [];
  if (imageWrapper) {
    // Clone the image/content wrapper
    const imageClone = imageWrapper.cloneNode(true);
    imageContent.push(imageClone);
  }

  // --- Compose columns ---
  // Left column: form
  // Right column: image/content
  const columnsRow = [formContent, imageContent];

  // --- Build table rows ---
  const rows = [headerRow, columnsRow];

  // --- Create table and replace ---
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
