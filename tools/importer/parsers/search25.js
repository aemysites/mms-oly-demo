/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Search (search25)'];

  // The second row must contain the query index URL (absolute)
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;

  // Extract all visible text content from the source html
  // Use less specific selectors to capture all text content
  let textContent = '';
  // Get all text nodes under the element, including label, placeholder, etc.
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (node.parentElement && node.textContent.trim()) {
        // Exclude script/style
        const tag = node.parentElement.tagName.toLowerCase();
        if (tag !== 'script' && tag !== 'style') {
          return NodeFilter.FILTER_ACCEPT;
        }
      }
      return NodeFilter.FILTER_REJECT;
    }
  });
  let node;
  const texts = [];
  while ((node = walker.nextNode())) {
    texts.push(node.textContent.trim());
  }
  textContent = texts.join(' ');

  // Compose a content block that includes all text content and the query index link
  const contentDiv = document.createElement('div');
  if (textContent) {
    const textEl = document.createElement('div');
    textEl.textContent = textContent;
    contentDiv.appendChild(textEl);
  }
  contentDiv.appendChild(link);

  const contentRow = [contentDiv];

  // Build the table
  const cells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
