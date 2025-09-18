/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract immediate children with a class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Find the main wrapper for the visible view
  const view = element.querySelector('.view-about-you-selected');
  if (!view) return;

  // Get the main wrapper inside the selected view
  const wrapper = view.querySelector('.wrapper');
  if (!wrapper) return;

  // Get all top-level columns in the wrapper
  const topCols = getDirectChildrenByClass(wrapper, 'col');
  if (topCols.length < 2) return;

  // First column: About You title and icon
  const aboutCol = topCols[0];
  // Second column: contains three sub-columns (Salary, Lease Term, Annual Travel km)
  const detailsCol = topCols[1];
  const detailCols = getDirectChildrenByClass(detailsCol, 'col');

  // Build first row: About You + icon
  const aboutTitle = aboutCol.querySelector('.title');
  const aboutImg = aboutCol.querySelector('img');
  const aboutCell = document.createElement('div');
  if (aboutTitle) aboutCell.appendChild(aboutTitle.cloneNode(true));
  if (aboutImg) aboutCell.appendChild(aboutImg.cloneNode(true));

  // Build details cells (ensure text content is included)
  const detailCells = detailCols.map(col => {
    const cellDiv = document.createElement('div');
    const title = col.querySelector('.title');
    let value = null;
    for (const child of col.children) {
      if (child !== title && child.tagName === 'DIV') {
        value = child;
        break;
      }
    }
    if (title) cellDiv.appendChild(title.cloneNode(true));
    if (value) cellDiv.appendChild(value.cloneNode(true));
    if (!cellDiv.textContent.trim()) {
      cellDiv.textContent = col.textContent.trim();
    }
    return cellDiv;
  });

  // Now find the search view (for second row)
  const searchView = element.querySelector('.view-search');
  let searchCols = [];
  if (searchView) {
    searchCols = getDirectChildrenByClass(searchView, 'col');
  }

  // Table header
  const headerRow = ['Columns (columns49)'];

  // Table second row: About You column + details columns
  const secondRow = [aboutCell, ...detailCells];
  const colCount = secondRow.length;

  // Table third row: search columns (if present)
  let thirdRow = null;
  if (searchCols.length) {
    thirdRow = [];
    for (let i = 0; i < colCount; i++) {
      if (searchCols[i]) {
        const div = document.createElement('div');
        Array.from(searchCols[i].childNodes).forEach(n => div.appendChild(n.cloneNode(true)));
        if (!div.textContent.trim()) {
          div.textContent = searchCols[i].textContent.trim();
        }
        thirdRow.push(div);
      } else {
        thirdRow.push(''); // Pad with empty string for missing columns
      }
    }
  }

  // Build cells array
  const cells = [headerRow, secondRow];
  if (thirdRow && thirdRow.length) cells.push(thirdRow);

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
