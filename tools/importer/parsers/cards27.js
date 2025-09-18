/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extracts the image (picture/img) from a card block
  function extractImage(card) {
    const pic = card.querySelector('picture');
    if (pic) return pic;
    const img = card.querySelector('img');
    if (img) return img;
    return '';
  }

  // Helper: Extracts all text content from a card block, in order
  function extractText(card) {
    const fragments = [];
    Array.from(card.children).forEach(child => {
      // Exclude <picture> (image)
      if (child.tagName === 'P' && child.querySelector('picture')) return;
      // For <p>, <h3>, <ul>, <div class="button-container">, <a>
      if (
        child.tagName === 'P' ||
        child.tagName === 'H3' ||
        child.tagName === 'UL' ||
        child.tagName === 'DIV' ||
        child.tagName === 'A'
      ) {
        // For button-container, get the link inside
        if (child.classList.contains('button-container')) {
          const a = child.querySelector('a');
          if (a) fragments.push(a);
        } else {
          fragments.push(child);
        }
      }
    });
    return fragments;
  }

  // Find the columns block (the cards container)
  let columnsBlock = element;
  if (!columnsBlock.classList.contains('columns')) {
    columnsBlock = element.querySelector('.columns');
  }
  if (!columnsBlock) return;

  // Each card is a direct child of columnsBlock
  const cardDivs = Array.from(columnsBlock.children).filter(child => child.tagName === 'DIV');

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards27)'];
  rows.push(headerRow);

  // Card rows: Each card gets its own row with 2 columns
  cardDivs.forEach(card => {
    // Image/Icon cell
    const image = extractImage(card);
    // Text cell: all text fragments in visual order
    const textContent = extractText(card);
    rows.push([
      image ? image : '',
      textContent.length ? textContent : '',
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table block
  element.replaceWith(table);
}
