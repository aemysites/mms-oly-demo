/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Cards (cardsNoImages17)'];
  const rows = [headerRow];

  // Defensive: Find the columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) {
    // If not found, remove element and exit
    element.remove();
    return;
  }

  // Defensive: Find the direct child container holding the cards
  // Usually the first child of columnsBlock
  const cardsContainer = columnsBlock.querySelector(':scope > div');
  if (!cardsContainer) {
    element.remove();
    return;
  }

  // Each card is a div inside the cardsContainer
  const cardDivs = Array.from(cardsContainer.children);

  cardDivs.forEach((cardDiv) => {
    // Each cardDiv should contain a <p> (or possibly more content)
    // We'll put the whole cardDiv into the cell for resilience
    rows.push([cardDiv]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
