/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (block name)
  const headerRow = ['Columns (columns22)'];

  // 2. Columns row: visually, screenshot shows 3 columns
  // - Left: logo, phone, button
  // - Middle: Quick Links
  // - Right: Legal

  // --- Left Column ---
  // Find <picture>, phone <p>, button <p>
  let picture = element.querySelector('picture');
  let phone = null;
  let button = null;
  Array.from(element.querySelectorAll('p')).forEach((p) => {
    if (!phone && /^\s*\d{4}\s*\d{3}\s*\d{3}\s*$/.test(p.textContent)) phone = p;
    if (!button && p.classList.contains('button-container')) button = p;
  });
  const leftCol = [];
  if (picture) leftCol.push(picture);
  if (phone) leftCol.push(phone);
  if (button) leftCol.push(button);

  // --- Middle & Right Columns ---
  // Find nav.footer-nav-links > ul > li
  const nav = element.querySelector('nav.footer-nav-links');
  let quickLinks = null, legalLinks = null;
  if (nav) {
    const navLis = Array.from(nav.querySelectorAll(':scope > ul > li'));
    if (navLis.length > 0) quickLinks = navLis[0];
    if (navLis.length > 1) legalLinks = navLis[1];
  }

  // Compose columns row: each cell is an array of referenced elements (not clones)
  const columnsRow = [leftCol, quickLinks ? [quickLinks] : [], legalLinks ? [legalLinks] : []];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
