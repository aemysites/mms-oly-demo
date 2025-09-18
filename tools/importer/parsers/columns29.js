/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the content for each column
  function extractColumnContent(wrapper) {
    // Find the first picture/img
    const picture = wrapper.querySelector('picture');
    // Find the h4 link (category title)
    const h4Link = wrapper.querySelector('a > h4') ? wrapper.querySelector('a') : null;
    // Find the list of links (if any)
    const list = wrapper.querySelector('ul');
    // Compose the column content
    const content = [];
    if (picture) content.push(picture);
    if (h4Link) content.push(h4Link);
    if (list && list.children.length > 0) {
      // Remove all divider spans from the list
      Array.from(list.querySelectorAll('span.divider')).forEach(divider => divider.remove());
      content.push(list);
    }
    return content;
  }

  // Get all immediate .header-nav-wrapper children
  const wrappers = Array.from(element.querySelectorAll(':scope > .header-nav-wrapper'));

  // Each wrapper is a column
  const columns = wrappers.map(extractColumnContent);

  // Build the table rows
  const headerRow = ['Columns (columns29)'];
  const columnsRow = columns;

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
