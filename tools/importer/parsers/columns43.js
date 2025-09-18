/* global WebImporter */
export default function parse(element, { document }) {
  // Get the wrapper containing the two columns
  const wrapper = element.querySelector('.car-features-wrapper');
  if (!wrapper) return;
  const block = wrapper.querySelector('.car-features.block');
  if (!block) return;
  // The block contains a single div with two children: detail-container and feature-container
  const inner = block.querySelector('div');
  if (!inner) return;
  // Get the two columns
  const columns = Array.from(inner.children);
  if (columns.length < 2) return;

  // Table header
  const headerRow = ['Columns (columns43)'];
  // Table content row: left = detail, right = features
  const contentRow = [columns[0], columns[1]];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the element with the new table
  element.replaceWith(table);
}
