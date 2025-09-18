/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct child <li> of the cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const cardItems = Array.from(cardsBlock.querySelectorAll(':scope > ul > li'));

  // Table header as per block requirements
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // Image cell: find the <img> inside .cards-card-image
    const imageWrapper = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageWrapper) {
      const img = imageWrapper.querySelector('img');
      if (img) imageCell = img;
    }

    // Text cell: gather all text content from .cards-card-body
    const body = li.querySelector('.cards-card-body');
    let textCell = '';
    if (body) {
      // We'll collect elements in order: h6 (optional), h3 (title), all <p> (desc, meta, cta)
      const textParts = [];
      // Category (h6)
      const h6 = body.querySelector('h6');
      if (h6) textParts.push(h6);
      // Title (h3)
      const h3 = body.querySelector('h3');
      if (h3) textParts.push(h3);
      // All <p> except button-container
      const ps = Array.from(body.querySelectorAll('p:not(.button-container)'));
      ps.forEach((p) => textParts.push(p));
      // CTA (button)
      const buttonContainer = body.querySelector('p.button-container');
      if (buttonContainer) textParts.push(buttonContainer);
      textCell = textParts;
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
