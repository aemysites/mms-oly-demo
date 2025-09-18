/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content wrapper
  const mainDiv = element.querySelector('.footer-nav-div');
  if (!mainDiv) return;

  // Get all direct children of the main content wrapper
  const children = Array.from(mainDiv.children);

  // --- First column content ---
  // <p> <picture>...</picture> </p>
  const logoPictureP = children[0];
  // <p><strong>1300 328 182</strong></p>
  const phoneP = children[1];
  // <p class="button-container"><a ...>Contact Oly</a></p>
  const buttonP = children[2];

  // --- Second and third columns: nav lists ---
  // <nav class="footer-nav-links"><ul> ... </ul></nav>
  const nav = children.find((c) => c.tagName === 'NAV');
  let quickLinks = null;
  let legalLinks = null;
  if (nav) {
    const navLists = nav.querySelectorAll(':scope > ul > li');
    if (navLists.length > 0) {
      // Each li is a column: first is Quick Links, second is Legal
      quickLinks = navLists[0];
      legalLinks = navLists[1];
    }
  }

  // Build the table rows
  const headerRow = ['Columns (columns13)'];

  // Compose first column: logo, phone, button
  const firstColContent = [];
  if (logoPictureP) firstColContent.push(logoPictureP);
  if (phoneP) firstColContent.push(phoneP);
  if (buttonP) firstColContent.push(buttonP);

  // Compose second column: Quick Links
  const secondColContent = [];
  if (quickLinks) secondColContent.push(quickLinks);

  // Compose third column: Legal Links
  const thirdColContent = [];
  if (legalLinks) thirdColContent.push(legalLinks);

  // Build the columns row
  const columnsRow = [firstColContent, secondColContent, thirdColContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
