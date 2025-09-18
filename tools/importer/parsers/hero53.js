/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  const getDirectChild = (parent, selector) => {
    return Array.from(parent.children).find((el) => el.matches(selector));
  };

  // 1. Header row
  const headerRow = ['Hero (hero53)'];

  // 2. Image row
  let imageRowContent = null;
  // Find the hero-image0 container
  const heroImageContainer = Array.from(element.querySelectorAll(':scope .hero-image0')).find(Boolean);
  if (heroImageContainer) {
    // Find the <img> inside <picture>
    const picture = heroImageContainer.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        imageRowContent = img;
      }
    }
  }
  // If no image found, leave cell empty
  const imageRow = [imageRowContent || ''];

  // 3. Content row (title, subheading, CTA)
  let contentRowContent = [];
  // Find the hero-content container
  const heroContentContainer = Array.from(element.querySelectorAll(':scope .hero-content')).find(Boolean);
  if (heroContentContainer) {
    // The actual content is in the first child div
    const innerContentDiv = getDirectChild(heroContentContainer, 'div');
    if (innerContentDiv) {
      // Collect all children (p, h1, etc)
      const children = Array.from(innerContentDiv.children);
      // We'll push all children in order
      contentRowContent = children;
    }
  }
  const contentRow = [contentRowContent.length ? contentRowContent : ''];

  // Compose table rows
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
