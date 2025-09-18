/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Columns (columns24)'];

  // Defensive: Find the columns block structure
  // The source HTML is a wrapper with two main children: one for text, one for image
  // Get immediate children of the main columns block
  const columnsWrapper = element.querySelector('.columns-wrapper');
  if (!columnsWrapper) return;

  const columnsBlock = columnsWrapper.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the column children (should be two: left text, right image)
  const columnChildren = Array.from(columnsBlock.children[0].children);
  // Defensive: If not exactly two columns, fallback to all direct children
  let leftCol, rightCol;
  if (columnChildren.length === 2) {
    [leftCol, rightCol] = columnChildren;
  } else {
    leftCol = columnChildren[0] || columnsBlock.children[0];
    rightCol = columnChildren[1] || null;
  }

  // Left column: contains headings and paragraph
  // Right column: contains picture (image)

  // For the left column, include all its children as a fragment
  const leftContent = document.createElement('div');
  Array.from(leftCol.children).forEach(child => leftContent.appendChild(child));

  // For the right column, find the image (picture or img)
  let rightContent = null;
  if (rightCol) {
    // Prefer the <picture> element if present
    const picture = rightCol.querySelector('picture');
    if (picture) {
      rightContent = picture;
    } else {
      // Fallback to any <img> inside rightCol
      const img = rightCol.querySelector('img');
      if (img) rightContent = img;
    }
  }

  // Compose the second row: two columns, left is text, right is image
  const secondRow = [leftContent, rightContent].filter(Boolean);

  // Build the table
  const cells = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
