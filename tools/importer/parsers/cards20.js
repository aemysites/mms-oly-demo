/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the actual block root (in case wrapper is passed)
  let block = element;
  if (block.classList.contains('thumbnail-car-wrapper')) {
    const inner = block.querySelector('.thumbnail-car.block');
    if (inner) block = inner;
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards20)']);

  // Each card is a row: image/icon in col 1, text in col 2
  // The structure is:
  // <div.thumbnail-car.block>
  //   <div> <div><p>Title</p></div> </div>
  //   <div> <div><picture>...</picture></div> </div>
  // </div>
  // Defensive: find all immediate children divs
  const cardDivs = Array.from(block.children).filter(child => child.tagName === 'DIV');
  if (cardDivs.length >= 2) {
    // Title container
    const titleDiv = cardDivs[0];
    // Defensive: find the <p> inside
    const titleP = titleDiv.querySelector('p');
    // Image container
    const imageDiv = cardDivs[1];
    const picture = imageDiv.querySelector('picture');
    let img = null;
    if (picture) {
      img = picture.querySelector('img');
    }
    // First cell: image (picture preferred, fallback to img)
    let imageCell = null;
    if (picture) {
      imageCell = picture;
    } else if (img) {
      imageCell = img;
    } else {
      imageCell = '';
    }
    // Second cell: text (title as heading)
    let textCell = '';
    if (titleP) {
      // Create heading element
      const heading = document.createElement('h3');
      heading.textContent = titleP.textContent;
      textCell = heading;
    }
    rows.push([imageCell, textCell]);
  }

  // Replace the block with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
