/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns42)'];

  // Defensive: find the columns block (may be nested)
  let columnsBlock = element;
  if (!columnsBlock.classList.contains('columns')) {
    columnsBlock = element.querySelector('.columns');
  }
  if (!columnsBlock) return;

  // Get immediate column children (should be two columns)
  const columnDivs = Array.from(columnsBlock.querySelectorAll(':scope > div > div'));
  // Fallback: if not found, try direct children
  if (!columnDivs.length) {
    // Some sources may have direct divs
    const directDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));
    if (directDivs.length === 2) {
      columnDivs.push(...directDivs);
    }
  }

  // Defensive: ensure we have two columns
  if (columnDivs.length < 2) return;

  // First column: all children (text, heading, button)
  const col1 = columnDivs[0];
  // Second column: image (picture)
  const col2 = columnDivs[1];

  // For each column, collect all children as a fragment
  const col1Children = Array.from(col1.childNodes).filter((node) => {
    // Only include elements and non-empty text nodes
    return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
  });
  const col2Children = Array.from(col2.childNodes).filter((node) => {
    return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
  });

  // Table: header row, then columns row
  const tableCells = [
    headerRow,
    [col1Children, col2Children]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace original element
  element.replaceWith(block);
}
