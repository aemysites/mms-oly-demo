/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: find left and right column wrappers
  let leftCol, rightCol;
  if (topDivs.length === 2) {
    leftCol = topDivs[0];
    rightCol = topDivs[1];
  } else {
    // fallback: try to find columns by structure
    leftCol = element;
    rightCol = null;
  }

  // Left column: contains heading, description, app images, and steps
  let leftContent = [];
  if (leftCol) {
    // Find the deepest div with actual content
    let contentDiv = leftCol.querySelector('.download-app.block');
    if (!contentDiv) contentDiv = leftCol;
    // Find the div with all text and images
    let innerDivs = Array.from(contentDiv.querySelectorAll(':scope > div'));
    let mainDiv = innerDivs[0] || contentDiv;
    // Collect all children except the image column
    leftContent = Array.from(mainDiv.children);
  }

  // App store images (apple & android)
  let appImages = [];
  if (leftCol) {
    const appleImg = leftCol.querySelector('#img-apple img');
    const androidImg = leftCol.querySelector('#img-android img');
    if (appleImg) appImages.push(appleImg);
    if (androidImg) appImages.push(androidImg);
  }

  // Remove empty paragraphs from leftContent
  leftContent = leftContent.filter(el => {
    if (el.tagName === 'P' && el.textContent.trim() === '') return false;
    return true;
  });

  // Insert appImages after the description paragraph (after heading)
  let leftColElements = [];
  for (let i = 0; i < leftContent.length; i++) {
    leftColElements.push(leftContent[i]);
    // After the first paragraph after heading, insert images
    if (leftContent[i].tagName === 'P' && appImages.length > 0) {
      leftColElements.push(...appImages);
      appImages = []; // Only insert once
    }
  }

  // Right column: phone image
  let rightColElement = null;
  if (rightCol) {
    // Try to find the phone image
    const phoneImg = rightCol.querySelector('img');
    if (phoneImg) {
      rightColElement = phoneImg;
    } else {
      // fallback: use the whole rightCol
      rightColElement = rightCol;
    }
  } else {
    // fallback: try to find phone image anywhere
    const phoneImg = element.querySelector('img[width="388"]');
    if (phoneImg) rightColElement = phoneImg;
  }

  // Table header
  const headerRow = ['Columns (columns30)'];
  // Table columns: left and right
  const columnsRow = [leftColElements, rightColElement];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
