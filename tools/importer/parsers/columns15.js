/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct children by class name
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Get hero-image0, hero-content
  const contentDiv = getDirectChildByClass(element.querySelector('.hero-wrapper .hero'), 'content');

  // Defensive: fallback if .content not found
  const contentRoot = contentDiv || element;

  // Left column: .hero-content
  // Right column: .hero-image0
  const heroContentWrap = getDirectChildByClass(contentRoot, 'hero-content');
  const heroImage0Wrap = getDirectChildByClass(contentRoot, 'hero-image0');

  // Defensive: find inner content
  let leftColContent = null;
  if (heroContentWrap) {
    // The inner <div> contains the text
    leftColContent = heroContentWrap.querySelector('div') || heroContentWrap;
  }

  let rightColContent = null;
  if (heroImage0Wrap) {
    // The inner <div> contains the <picture>
    rightColContent = heroImage0Wrap.querySelector('div') || heroImage0Wrap;
  }

  // Build the table rows
  const headerRow = ['Columns (columns15)'];
  const columnsRow = [
    leftColContent ? leftColContent : '',
    rightColContent ? rightColContent : '',
  ];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
