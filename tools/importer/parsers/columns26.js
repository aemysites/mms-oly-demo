/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main filter block
  const filterBlock = element.querySelector('.filter-block');
  if (!filterBlock) return;

  // Get header and controls (first row)
  const filterHeader = filterBlock.querySelector('.filter-header');
  let leftHeader = filterHeader ? filterHeader.querySelector('h2') : '';
  let rightControls = filterHeader ? filterHeader.querySelector('.filter-controls') : '';

  // Get filter container (second row)
  const filterContainer = filterBlock.querySelector('.filter-container-block') || '';
  // Get actions (third row)
  const filterActions = filterBlock.querySelector('.filter-actions') || '';

  // Build table rows
  const headerRow = ['Columns (columns26)'];
  // All rows after header must have the same number of columns as the second row
  // We'll use two columns: left and right, and avoid unnecessary empty columns
  const rows = [
    headerRow,
    [leftHeader, rightControls],
    [filterContainer, ''],
    [filterActions, ''],
  ];

  // Remove unnecessary empty columns: only keep as many columns as the second row
  const numCols = rows[1].length;
  for (let i = 2; i < rows.length; i++) {
    rows[i] = rows[i].slice(0, numCols);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
