/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Tabs (tabs5)'];

  // Defensive: find the wrapper for tab links/content
  const contentWrapper = element.querySelector('.default-content-wrapper') || element;

  // Get all tab link paragraphs
  const tabLinks = Array.from(contentWrapper.querySelectorAll('p.button-container'));

  // Each tab: label is the link text, content is the full paragraph (to include all text)
  const rows = tabLinks.map((p) => {
    // Defensive: find the first link in the paragraph
    const link = p.querySelector('a');
    if (!link) return null;
    // Tab label: link text
    const tabLabel = link.textContent.trim();
    // Tab content: the paragraph itself (to ensure all text is included)
    return [tabLabel, p.cloneNode(true)];
  }).filter(Boolean);

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
