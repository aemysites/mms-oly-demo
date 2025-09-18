/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;

  // Find the two column containers (should be text and image)
  let textCol = null;
  let imgCol = null;
  const columnContainers = Array.from(columnsBlock.children);
  if (columnContainers.length === 1) {
    // Sometimes columnsBlock has one child, which contains two columns
    const innerDivs = Array.from(columnContainers[0].children);
    if (innerDivs.length === 2) {
      textCol = innerDivs[0];
      imgCol = innerDivs[1];
    }
  } else if (columnContainers.length === 2) {
    textCol = columnContainers[0];
    imgCol = columnContainers[1];
  } else {
    // Fallback: try to find text and image columns
    textCol = columnsBlock.querySelector(':scope > div:not(.columns-img-col)');
    imgCol = columnsBlock.querySelector(':scope > div.columns-img-col');
  }
  if (!textCol && columnContainers.length > 0) textCol = columnContainers[0];
  if (!imgCol && columnContainers.length > 1) imgCol = columnContainers[1];

  // Gather text content (header and paragraphs)
  let textElements = [];
  if (textCol) {
    textElements = Array.from(textCol.children).filter(
      el => ['H1','H2','H3','H4','H5','H6','P','UL','OL'].includes(el.tagName)
    );
    // Remove leading <br> and &nbsp; from heading
    if (textElements[0] && textElements[0].tagName.match(/^H[1-6]$/)) {
      textElements[0].innerHTML = textElements[0].innerHTML.replace(/^(&nbsp;)?<br\s*\/?>/, '').trim();
    }
  }

  // Gather image content (picture or img)
  let imgContent = '';
  if (imgCol) {
    let picture = imgCol.querySelector('picture');
    let img = imgCol.querySelector('img');
    if (picture) {
      imgContent = picture;
    } else if (img) {
      imgContent = img;
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns35)'];
  const contentRow = [
    textElements.length ? textElements : '',
    imgContent ? imgContent : ''
  ];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
