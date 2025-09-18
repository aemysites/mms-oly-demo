/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first img in a picture
  function getImgFromPicture(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Find the relevant content containers
  const heroImage0 = element.querySelector('.hero-image0 picture');
  const heroImage1 = element.querySelector('.hero-image1 picture');
  const heroContentDiv = element.querySelector('.hero-content > div');

  // Defensive: fallback to empty if not found
  const img0 = getImgFromPicture(heroImage0);
  const img1 = getImgFromPicture(heroImage1);

  // For the left column: text content
  let leftColContent = [];
  if (heroContentDiv) {
    // Clone children to avoid moving them out of the DOM
    leftColContent = Array.from(heroContentDiv.childNodes).map((node) => node.cloneNode(true));
  }

  // For the right column: main image (the phone)
  let rightColContent = [];
  if (img1) {
    rightColContent = [img1];
  }

  // Build the table rows
  const headerRow = ['Columns (columns51)'];
  const contentRow = [leftColContent, rightColContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
