/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name and variant as the header row
  const headerRow = ['Search (search44)'];

  // The second row must contain the absolute URL to the query index
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';

  // Extract all visible instructional text from the source html
  let labelText = '';
  // Try to get any label or instructional text, but also fallback to other text nodes
  const label = element.querySelector('label');
  if (label) {
    labelText = label.textContent.trim();
  } else {
    // Fallback: look for text nodes directly inside the search block
    const possibleText = Array.from(element.querySelectorAll('*')).map(el => el.childNodes)
      .flat()
      .filter(n => n.nodeType === 3 && n.textContent.trim())
      .map(n => n.textContent.trim());
    if (possibleText.length) {
      labelText = possibleText.join(' ');
    }
  }

  // Compose the cell content for the second row: label text + query index url
  let cellContent;
  if (labelText) {
    // If there's label text, include it above the URL
    const frag = document.createElement('div');
    const labelDiv = document.createElement('div');
    labelDiv.textContent = labelText;
    frag.appendChild(labelDiv);
    const urlDiv = document.createElement('div');
    urlDiv.textContent = queryIndexUrl;
    frag.appendChild(urlDiv);
    cellContent = frag;
  } else {
    cellContent = queryIndexUrl;
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent],
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
