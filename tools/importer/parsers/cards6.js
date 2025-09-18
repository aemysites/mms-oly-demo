/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first descendant picture or img element
  function extractImage(card) {
    // Try to find <picture> first, fallback to <img>
    let pic = card.querySelector('picture');
    if (pic) return pic;
    let img = card.querySelector('img');
    return img || null;
  }

  // Helper to extract the text content for the card
  function extractTextContent(card) {
    // We'll collect all non-image, non-picture, non-source elements
    // The structure is: [optional small text], heading, description, button
    const textContent = document.createElement('div');

    // Get all direct children
    const children = Array.from(card.children);
    // Remove the image/picture paragraph
    let idx = 0;
    if (children[idx] && children[idx].querySelector && (children[idx].querySelector('picture') || children[idx].querySelector('img'))) {
      idx++;
    }

    // Optional small text (usually a <p> before heading)
    if (children[idx] && children[idx].tagName === 'P' && !children[idx].classList.contains('button-container')) {
      textContent.appendChild(children[idx].cloneNode(true));
      idx++;
    }

    // Heading (usually <h3> or <h2>)
    if (children[idx] && /^H[1-6]$/.test(children[idx].tagName)) {
      textContent.appendChild(children[idx].cloneNode(true));
      idx++;
    }

    // Description (usually <p>, but not button-container)
    if (children[idx] && children[idx].tagName === 'P' && !children[idx].classList.contains('button-container')) {
      textContent.appendChild(children[idx].cloneNode(true));
      idx++;
    }

    // Button (optional, class 'button-container')
    if (children[idx] && children[idx].classList && children[idx].classList.contains('button-container')) {
      textContent.appendChild(children[idx].cloneNode(true));
      idx++;
    }

    return textContent;
  }

  // Find all cards: immediate children of the innermost columns block
  let cards = [];
  // Defensive: find the columns block
  let columnsBlock = element.querySelector('.columns.block');
  if (columnsBlock) {
    // The cards are direct children of the first child of columnsBlock
    let inner = columnsBlock.firstElementChild;
    if (inner) {
      cards = Array.from(inner.children);
    }
  }

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards6)'];
  rows.push(headerRow);

  // For each card, extract image and text content
  cards.forEach(card => {
    const image = extractImage(card);
    const textContent = extractTextContent(card);
    rows.push([
      image ? image : '',
      textContent
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
