/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  // Find the cards block (defensive: could be the element itself or a child)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  if (!cardsBlock) return;

  // Find all card <li> elements
  const cardLis = cardsBlock.querySelectorAll('ul > li');
  cardLis.forEach((li) => {
    // Image cell: find the image (prefer <picture>, fallback to <img>)
    let imageCell = '';
    const imageWrapper = li.querySelector('.cards-card-image');
    if (imageWrapper) {
      const picture = imageWrapper.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageWrapper.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: collect ALL text content from the card body, including headings, paragraphs, buttons, etc.
    const body = li.querySelector('.cards-card-body');
    const textCellContent = [];
    if (body) {
      // Include all children of the body, in order, except empty whitespace nodes
      Array.from(body.childNodes).forEach((node) => {
        // Only include elements and meaningful text nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          textCellContent.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap text nodes in a <span> for consistency
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textCellContent.push(span);
        }
      });
    }

    // Only add row if there is at least some text content
    if (imageCell || textCellContent.length) {
      rows.push([
        imageCell,
        textCellContent.length === 1 ? textCellContent[0] : textCellContent
      ]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
