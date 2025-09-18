/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only proceed if there are columns
  if (!columns.length) return;

  // The header row per spec
  const headerRow = ['Columns (columns16)'];

  // The columns row: each cell is the content of a column div
  const columnsRow = columns.map((col) => {
    // Gather all direct children (preserve structure)
    return Array.from(col.childNodes).filter((node) => {
      // Only include elements and text nodes with content
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      return false;
    });
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
