/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (picture or img) from a card div
  function extractImage(cardDiv) {
    // Look for the first <picture> or <img> inside the card
    const pic = cardDiv.querySelector('picture');
    if (pic) return pic;
    const img = cardDiv.querySelector('img');
    if (img) return img;
    return '';
  }

  // Helper to extract the text content (heading, description, CTA) from a card div
  function extractTextContent(cardDiv) {
    const fragment = document.createDocumentFragment();
    // Heading: look for h4 or h3 or h2 or h1
    const heading = cardDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      fragment.appendChild(heading);
    }
    // Description: first p after heading that is not the image or button-container
    // Get all <p> that are not inside .button-container and not containing <picture>
    const paragraphs = Array.from(cardDiv.querySelectorAll('p')).filter(p => {
      if (p.classList.contains('button-container')) return false;
      if (p.querySelector('picture')) return false;
      return true;
    });
    if (paragraphs.length > 0) {
      fragment.appendChild(paragraphs[0]);
    }
    // CTA: look for a link inside .button-container
    const buttonContainer = cardDiv.querySelector('.button-container');
    if (buttonContainer) {
      // Use the whole buttonContainer (it may have <em> and <a>)
      fragment.appendChild(buttonContainer);
    }
    return fragment;
  }

  // Get all card divs (immediate children)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards45)']);

  // Card rows
  cardDivs.forEach(cardDiv => {
    const image = extractImage(cardDiv);
    const textContent = extractTextContent(cardDiv);
    rows.push([
      image || '',
      textContent || ''
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
