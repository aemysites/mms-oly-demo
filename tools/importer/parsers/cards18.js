/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Defensive: find the columns block (could be the element itself or a child)
  let columnsBlock = element;
  if (!columnsBlock.classList.contains('columns')) {
    columnsBlock = element.querySelector('.columns');
  }
  if (!columnsBlock) return;

  // Find all direct card containers (each card is a direct child of columnsBlock)
  const cardContainers = Array.from(columnsBlock.children).filter(
    (col) => col.nodeType === 1
  );

  cardContainers.forEach((card) => {
    // Find the image (first <picture> or <img> inside a <p>)
    let imageEl = null;
    const imageP = card.querySelector('p picture');
    if (imageP) {
      imageEl = imageP.closest('picture');
    } else {
      const img = card.querySelector('img');
      if (img) imageEl = img;
    }

    // Find the first non-empty heading (h4 or h3)
    let headingEl = card.querySelector('h4, h3');
    if (headingEl && !headingEl.textContent.trim()) headingEl = null;

    // Find all <p> that are not the image or button
    const allPs = Array.from(card.querySelectorAll('p'));
    // Remove <p> containing <picture> (the image)
    const textPs = allPs.filter((p) => !p.querySelector('picture'));
    // Remove <p> with class 'button-container' (the CTA)
    const descPs = textPs.filter((p) => !p.classList.contains('button-container'));
    // The description is all of these
    const descriptionEls = descPs;

    // Find the CTA link (first <a> inside p.button-container)
    let ctaEl = card.querySelector('p.button-container a, a.button');

    // Build the text cell content (heading, description(s), CTA)
    const textCellContent = [];
    if (headingEl) textCellContent.push(headingEl);
    if (descriptionEls.length > 0) textCellContent.push(...descriptionEls);
    if (ctaEl) textCellContent.push(ctaEl);

    // Only push row if there is some content
    if (imageEl || textCellContent.length > 0) {
      rows.push([
        imageEl || '',
        textCellContent
      ]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
