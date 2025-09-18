/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (picture or img) from a card div
  function extractImage(cardDiv) {
    // Look for picture first, fallback to img
    let pic = cardDiv.querySelector('picture');
    if (pic) return pic;
    let img = cardDiv.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to extract the text content (title, description, CTA) from a card div
  function extractTextContent(cardDiv) {
    // We'll collect: category (Calculator), title (h3), description (p), CTA (a.button)
    const textNodes = [];
    // Category (first <p> after image)
    const paragraphs = Array.from(cardDiv.querySelectorAll('p'));
    let picIdx = paragraphs.findIndex(p => p.querySelector('picture'));
    let categoryIdx = picIdx + 1;
    if (paragraphs[categoryIdx]) {
      textNodes.push(paragraphs[categoryIdx].cloneNode(true));
    }
    // Title (h3)
    const h3 = cardDiv.querySelector('h3');
    if (h3) {
      // If the h3 contains a <strong>, flatten it for consistency
      let h3Clone = h3.cloneNode(true);
      textNodes.push(h3Clone);
    }
    // Description (first <p> after h3)
    let descP = null;
    if (h3) {
      // Find the <p> after h3
      let next = h3.nextElementSibling;
      while (next && !(next.tagName === 'P' && !next.classList.contains('button-container'))) {
        next = next.nextElementSibling;
      }
      if (next) descP = next;
    }
    if (descP) {
      textNodes.push(descP.cloneNode(true));
    }
    // CTA (a.button inside .button-container)
    const btn = cardDiv.querySelector('p.button-container a.button');
    if (btn) {
      // Place in a <p> for spacing
      const btnP = document.createElement('p');
      btnP.appendChild(btn.cloneNode(true));
      textNodes.push(btnP);
    }
    return textNodes;
  }

  // Find all card divs (each column is a card)
  // The structure is: columns-wrapper > columns.block > (row divs) > (card divs)
  let cards = [];
  // Find the main columns.block container
  const columnsBlock = element.querySelector('.columns.block');
  if (columnsBlock) {
    // Each direct child of columns.block is a row group (for 2x2 grid)
    const rowGroups = Array.from(columnsBlock.children);
    rowGroups.forEach(rowGroup => {
      // Each direct child of rowGroup is a card
      const cardDivs = Array.from(rowGroup.children);
      cards.push(...cardDivs);
    });
  }

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards48)'];
  rows.push(headerRow);

  // Each card: [image, text content]
  cards.forEach(cardDiv => {
    const img = extractImage(cardDiv);
    const textContent = extractTextContent(cardDiv);
    rows.push([
      img ? img.cloneNode(true) : '',
      textContent
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
