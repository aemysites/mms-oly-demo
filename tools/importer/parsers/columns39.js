/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Find the .container inside the block
  const container = element.querySelector('.container');
  if (!container) return;

  // 2. Get the three columns
  const col1 = getDirectChildByClass(container, 'col1');
  const col2 = getDirectChildByClass(container, 'col2');
  const col3 = getDirectChildByClass(container, 'col3');

  // Defensive: If any column is missing, fallback to empty div
  const col1Content = col1 ? Array.from(col1.childNodes) : [];
  const col2Content = col2 ? Array.from(col2.childNodes) : [];
  const col3Content = col3 ? Array.from(col3.childNodes) : [];

  // 3. Build the table rows
  const headerRow = ['Columns (columns39)'];
  const contentRow = [col1Content, col2Content, col3Content];

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
