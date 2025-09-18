/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first direct child with a class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  const headerRow = ['Cards (cards54)'];
  const tableRows = [headerRow];

  // Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  lis.forEach(li => {
    // Image cell
    const imgDiv = getDirectChildByClass(li, 'cards-card-image');
    let imgEl = null;
    if (imgDiv) {
      // Find the first <img> inside the image div
      imgEl = imgDiv.querySelector('img');
    }

    // Text cell
    const bodyDiv = getDirectChildByClass(li, 'cards-card-body');
    let textCellContent = [];
    if (bodyDiv) {
      // Get all children of the bodyDiv
      const children = Array.from(bodyDiv.children);
      // We'll collect elements in order, but skip the button-container for now
      let buttonContainer = null;
      children.forEach(child => {
        if (child.classList.contains('button-container')) {
          buttonContainer = child;
        } else {
          textCellContent.push(child);
        }
      });
      // If there's a button-container, add it at the end
      if (buttonContainer) {
        textCellContent.push(buttonContainer);
      }
    }

    // Defensive: if no text content, add an empty string
    if (textCellContent.length === 0) textCellContent = [''];

    tableRows.push([
      imgEl || '',
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
