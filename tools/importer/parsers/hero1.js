/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the main content container
  let heroBlock = element;
  // Defensive: find the deepest .hero block if present
  const heroOfferBlock = element.querySelector('.hero.offerpage.block');
  if (heroOfferBlock) heroBlock = heroOfferBlock;

  // Get the .content div (contains all hero content)
  const contentDiv = getDirectChildByClass(heroBlock, 'content') || heroBlock;

  // Find hero-image0 (background image)
  const heroImage0 = getDirectChildByClass(contentDiv, 'hero-image0');
  let backgroundImg = null;
  if (heroImage0) {
    // Defensive: find <img> inside <picture>
    const img = heroImage0.querySelector('img');
    if (img) backgroundImg = img;
  }

  // Find hero-content (text and CTA)
  const heroContent = getDirectChildByClass(contentDiv, 'hero-content');
  let contentBlock = null;
  if (heroContent) {
    // Defensive: use the inner content div if present
    const innerContent = heroContent.querySelector('div') || heroContent;
    // Use the whole block for resilience
    contentBlock = innerContent;
  }

  // Table rows
  const headerRow = ['Hero (hero1)'];
  const imageRow = [backgroundImg ? backgroundImg : ''];
  const contentRow = [contentBlock ? contentBlock : ''];

  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
