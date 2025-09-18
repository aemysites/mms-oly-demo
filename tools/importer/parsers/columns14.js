/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns14)'];

  // Get all immediate child columns
  const cols = Array.from(element.querySelectorAll(':scope > .col'));

  // --- Column 1: Form elements ---
  let col1Content = [];
  const formWrapper = element.querySelector('.form-element-wrapper');
  if (formWrapper) col1Content.push(formWrapper);

  // --- Column 2: Hot deals ---
  let col2Content = [];
  const hotDealWrapper = element.querySelector('.hot-deal-wrapper');
  if (hotDealWrapper) col2Content.push(hotDealWrapper);

  // --- Column 3: The image ---
  let col3Content = [];
  const colWithImage = cols.find((col) => col.querySelector('picture'));
  if (colWithImage) {
    const picture = colWithImage.querySelector('picture');
    if (picture) col3Content.push(picture);
  }

  // Only include columns with content (no empty columns)
  const columnsRow = [];
  if (col1Content.length > 0) columnsRow.push(col1Content);
  if (col2Content.length > 0) columnsRow.push(col2Content);
  if (col3Content.length > 0) columnsRow.push(col3Content);

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
