/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the actual columns block inside wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all card groups (each group contains cards)
  const cardGroups = Array.from(columnsBlock.children);
  // We'll flatten all cards into a single array
  const cards = [];
  cardGroups.forEach(group => {
    Array.from(group.children).forEach(card => {
      cards.push(card);
    });
  });

  // Table header - always use exact block name
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // Find the image/icon (first <picture> or <img> inside <p>)
    let image = card.querySelector('picture, img');
    // If image is inside a <p>, clone the <p> to preserve structure
    let imageCell = '';
    const pWithImage = card.querySelector('p picture, p img');
    if (pWithImage) {
      imageCell = pWithImage.closest('p').cloneNode(true);
    } else if (image) {
      imageCell = image.cloneNode(true);
    }

    // Find the heading (h6, h3, h2, h4)
    let heading = card.querySelector('h6, h3, h2, h4');

    // Collect all <p> elements that do NOT contain the image
    const ps = Array.from(card.querySelectorAll('p')).filter(p => !p.querySelector('picture') && !p.querySelector('img'));

    // Compose text cell: heading + ALL <p> elements (to ensure all text is included)
    const textCell = [];
    if (heading) textCell.push(heading.cloneNode(true));
    if (ps.length) ps.forEach(p => textCell.push(p.cloneNode(true)));

    // Compose row: [image/icon, text] (always 2 columns)
    rows.push([
      imageCell || '',
      textCell.length ? textCell : '',
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
