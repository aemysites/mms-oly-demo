/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || element.tagName !== 'UL') return;
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  // Always produce two columns per card row (first cell empty if no image/icon)
  const lis = Array.from(element.children).filter((el) => el.tagName === 'LI');
  lis.forEach((li) => {
    // First cell: image/icon (none present in this HTML, so empty string)
    const imageCell = '';
    // Second cell: text content (include all HTML content of the LI)
    const textCell = Array.from(li.childNodes).map((node) => node.cloneNode ? node.cloneNode(true) : document.createTextNode(node.textContent || node));
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
