/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main wrapper for columns
  const wrapper = element.querySelector('.imagedesc-col2-inline-wrapper') || element;
  // Find the block container
  const block = wrapper.querySelector('.imagedesc-col2-inline.block') || wrapper;
  // Find the actual content container
  const container = block.querySelector('.container') || block;
  // Get the columns
  const col1 = container.querySelector('.col1');
  const col2 = container.querySelector('.col2');

  // Defensive: if columns are missing, fallback to direct children
  const columns = [];
  if (col1) columns.push(col1);
  if (col2) columns.push(col2);
  if (columns.length === 0) {
    // fallback: use all direct children
    columns.push(...container.children);
  }

  // Header row as specified
  const headerRow = ['Columns (columns38)'];
  // Second row: each column's content as a cell
  const contentRow = columns.map((col) => col);

  // Compose table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
