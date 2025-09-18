/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Hero (hero41)'];

  // Row 2: Background image (optional) -- must be present as an empty string if not available
  const imageRow = [''];

  // Row 3: All text content from the provided HTML, as an array of elements (not just plain text)
  const contentElements = Array.from(element.childNodes)
    .filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()))
    .map(node => node.cloneNode(true));
  const contentRow = [contentElements.length ? contentElements : ''];

  // Compose table: header, image row (even if empty), content row
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
