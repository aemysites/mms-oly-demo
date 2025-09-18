/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns: left (intro) and right (form)
  const columns = element.querySelectorAll(':scope > div');
  let leftCol = null;
  let rightCol = null;

  columns.forEach((col) => {
    if (col.classList.contains('default-content-wrapper')) {
      leftCol = col;
    } else if (col.classList.contains('form-wrapper')) {
      rightCol = col;
    }
  });

  // If not found, fallback to first/second child
  if (!leftCol && columns.length > 0) leftCol = columns[0];
  if (!rightCol && columns.length > 1) rightCol = columns[1];

  // --- Fix: Remove nested block and convert iframe to link ---
  // Find the form block inside rightCol
  const formBlock = rightCol.querySelector('.form.block');
  if (formBlock) {
    // Remove data-block-name and data-block-status attributes to avoid nested block
    formBlock.removeAttribute('data-block-name');
    formBlock.removeAttribute('data-block-status');
    //
    // Convert all iframes (except images) to links
    formBlock.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.getAttribute('src');
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.textContent = src;
        iframe.replaceWith(link);
      }
    });
  }

  const headerRow = ['Columns (columns11)'];
  const contentRow = [leftCol, rightCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
