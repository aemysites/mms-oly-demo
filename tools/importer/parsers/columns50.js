/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: convert iframes to links (except images)
  function convertIframesToLinks(root) {
    root.querySelectorAll('iframe[src]').forEach((iframe) => {
      // Only convert if not an image
      const src = iframe.getAttribute('src');
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.textContent = src;
        iframe.replaceWith(link);
      }
    });
  }

  // Header row
  const headerRow = ['Columns (columns50)'];

  // Defensive: get all immediate children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find left and right column content
  // Left: .default-content-wrapper
  // Right: .form-wrapper
  const leftCol = children.find((div) => div.classList.contains('default-content-wrapper'));
  const rightCol = children.find((div) => div.classList.contains('form-wrapper'));

  // Defensive fallback if not found
  const leftContent = leftCol ? leftCol.cloneNode(true) : document.createElement('div');
  const rightContent = rightCol ? rightCol.cloneNode(true) : document.createElement('div');

  // Convert iframes to links in both columns
  convertIframesToLinks(leftContent);
  convertIframesToLinks(rightContent);

  // Compose the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent],
  ];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
