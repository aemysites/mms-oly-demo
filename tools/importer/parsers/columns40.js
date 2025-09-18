/* global WebImporter */
export default function parse(element, { document }) {
  // Get all icon-text-widget-wrapper children (each is a column cell)
  const wrappers = Array.from(element.querySelectorAll(':scope > .icon-text-widget-wrapper'));
  if (!wrappers.length) return;

  // Group wrappers into rows of 2 columns each (as per screenshot)
  const columnsPerRow = 2;
  const rows = [];
  for (let i = 0; i < wrappers.length; i += columnsPerRow) {
    rows.push(wrappers.slice(i, i + columnsPerRow));
  }

  // Table header row
  const headerRow = ['Columns (columns40)'];

  // Table content rows: each row is an array of wrappers (cells)
  const tableRows = rows.map(row => row.map(cell => cell)); // reference existing elements

  // Assemble table data
  const tableData = [headerRow, ...tableRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
