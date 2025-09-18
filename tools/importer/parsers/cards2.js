/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Defensive: find the actual cards container (may be .cards or .cards.block)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) {
    cardsBlock = element;
  }

  // Find the <ul> containing the cards
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  // For each card <li>
  ul.querySelectorAll('li').forEach((li) => {
    // Image cell: find the image inside .cards-card-image
    let imgCell = '';
    const imgWrapper = li.querySelector('.cards-card-image');
    if (imgWrapper) {
      // Use the <picture> or <img> directly
      const pic = imgWrapper.querySelector('picture');
      if (pic) {
        imgCell = pic;
      } else {
        const img = imgWrapper.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // Text cell: gather all text content from .cards-card-body
    const body = li.querySelector('.cards-card-body');
    let textCell = '';
    if (body) {
      // We'll collect the heading(s), description, and CTA
      const textParts = [];
      // h6 (small heading/category)
      const h6 = body.querySelector('h6');
      if (h6) textParts.push(h6);
      // h3 (main title)
      const h3 = body.querySelector('h3');
      if (h3) textParts.push(h3);
      // All <p> except button-container
      body.querySelectorAll('p:not(.button-container)').forEach((p) => {
        textParts.push(p);
      });
      // CTA (button)
      const btn = body.querySelector('p.button-container');
      if (btn) textParts.push(btn);
      textCell = textParts;
    }

    rows.push([imgCell, textCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
