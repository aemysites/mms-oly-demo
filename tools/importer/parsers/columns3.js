/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (may be nested)
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) {
    // Defensive: fallback to first child div
    columnsBlock = Array.from(element.children).find(div => div.classList && div.classList.contains('columns.block')) || element;
  }

  // The direct children of columnsBlock are the content wrapper(s)
  let columnsRowDiv = Array.from(columnsBlock.children)[0];
  if (!columnsRowDiv) columnsRowDiv = columnsBlock;

  // Now, columnsRowDiv contains two children: one for text, one for image (or vice versa)
  const columnDivs = Array.from(columnsRowDiv.children).filter(child => child.nodeType === 1);

  // Defensive: filter out empty divs
  const filteredColumnDivs = columnDivs.filter(div => div.textContent.trim() !== '' || div.querySelector('img'));

  // If only one column found, treat as single column
  const columns = filteredColumnDivs.length > 1 ? filteredColumnDivs : columnDivs;

  // Compose the table rows
  const headerRow = ['Columns (columns3)'];
  const contentRow = columns.map(col => col);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
