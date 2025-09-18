/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image (first .hero-image0 or .hero-image1)
  let heroImg = null;
  const img0 = element.querySelector('.hero-image0 picture img');
  const img1 = element.querySelector('.hero-image1 picture img');
  if (img0) heroImg = img0;
  else if (img1) heroImg = img1;

  // Find the hero content (headline, CTA)
  let contentFragment = document.createDocumentFragment();
  const heroContentDiv = element.querySelector('.hero-content > div');
  if (heroContentDiv) {
    // Move all children into the fragment, preserving their structure
    Array.from(heroContentDiv.childNodes).forEach((node) => {
      contentFragment.appendChild(node.cloneNode(true));
    });
  }

  // Compose table rows
  const headerRow = ['Hero (hero47)'];
  const imageRow = [heroImg ? heroImg : '']; // Reference the actual element
  const contentRow = [contentFragment.childNodes.length ? contentFragment : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
