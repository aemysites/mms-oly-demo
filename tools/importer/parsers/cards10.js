/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all card items
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  if (!cardItems.length) return;

  // Header row as specified
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // For each card, extract image/icon and text content
  cardItems.forEach((li) => {
    // Image/Icon cell: find the <picture> or <img> inside .cards-card-image
    let imageCell = '';
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: gather title, description, and CTA
    const textDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (textDiv) {
      const textParts = [];
      // h6 (optional category)
      const h6 = textDiv.querySelector('h6');
      if (h6) textParts.push(h6);
      // h3 (main title)
      const h3 = textDiv.querySelector('h3');
      if (h3) textParts.push(h3);
      // All <p> except the one with class 'button-container'
      const paragraphs = Array.from(textDiv.querySelectorAll('p:not(.button-container)'));
      paragraphs.forEach(p => textParts.push(p));
      // CTA (button-container)
      const buttonP = textDiv.querySelector('p.button-container');
      if (buttonP) textParts.push(buttonP);
      textCell = textParts;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
