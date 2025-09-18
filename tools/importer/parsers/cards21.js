/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all card containers (each card is a direct child of the columns block)
  // Defensive: support both .columns-wrapper > .columns > div > div and .columns-wrapper > .columns > div
  let cardGroups = Array.from(element.querySelectorAll(':scope > div'));
  // If the first child is a .columns block, descend one more level
  if (cardGroups.length === 1 && cardGroups[0].classList.contains('columns')) {
    cardGroups = Array.from(cardGroups[0].querySelectorAll(':scope > div'));
  }

  // Now cardGroups should be two groups, each with two cards (for 4 cards total)
  // Each group is a <div> containing two <div>s, each representing a card
  const cards = [];
  cardGroups.forEach(group => {
    // Defensive: if group has direct <div> children, treat each as a card
    const cardDivs = Array.from(group.querySelectorAll(':scope > div'));
    if (cardDivs.length > 0) {
      cardDivs.forEach(card => cards.push(card));
    } else {
      // If not, treat the group itself as a card
      cards.push(group);
    }
  });

  // Build table rows
  const rows = [];
  // Header row as required
  rows.push(['Cards (cards21)']);

  // For each card, extract image/icon and text content
  cards.forEach(card => {
    // Find the image/icon (first <img> inside <picture> inside <p>)
    let imageEl = null;
    const picture = card.querySelector('picture');
    if (picture) {
      imageEl = picture.querySelector('img');
    }
    // Defensive: wrap image in <picture> if present, else just the img
    let imageCell = '';
    if (picture && imageEl) {
      imageCell = picture;
    } else if (imageEl) {
      imageCell = imageEl;
    }

    // Find the heading (h4) and description (first <p> after heading)
    const heading = card.querySelector('h4, h3, h2, h1');
    let desc = null;
    if (heading) {
      // Find the first <p> after heading
      let next = heading.nextElementSibling;
      while (next && next.tagName.toLowerCase() !== 'p') {
        next = next.nextElementSibling;
      }
      if (next && next.tagName.toLowerCase() === 'p') {
        desc = next;
      }
    }
    // Defensive: if no heading, try to find first <p> as description
    if (!heading && !desc) {
      desc = card.querySelector('p');
    }

    // Compose text cell: heading (if present), then description (if present)
    const textCell = [];
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);

    // Push row: [image/icon, text content]
    rows.push([imageCell, textCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
