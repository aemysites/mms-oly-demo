/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Table (table46)'];

  // Defensive: find the form block (should be only one)
  const formBlock = element.querySelector('.form.block form');
  if (!formBlock) return;

  // Get all fieldset wrappers (each row)
  const fieldsetWrappers = Array.from(formBlock.querySelectorAll('.fieldset-wrapper'));

  // For each fieldset (row), extract the three cells as text content
  const dataRows = fieldsetWrappers.map((fieldsetWrapper) => {
    const fieldset = fieldsetWrapper.querySelector('fieldset');
    if (!fieldset) return null;
    const fields = Array.from(fieldset.children).filter((el) => el.tagName === 'DIV');

    // Label cell: number-wrapper (input + label)
    let labelCell = '';
    const numberWrapper = fields.find((f) => f.classList.contains('number-wrapper'));
    if (numberWrapper) {
      const label = numberWrapper.querySelector('label');
      labelCell = label ? label.textContent.trim() : '';
    } else {
      // For the last row, no number-wrapper, use select-wrapper label
      const selectWrapper = fields.find((f) => f.classList.contains('select-wrapper'));
      if (selectWrapper) {
        const select = selectWrapper.querySelector('select');
        if (select) {
          labelCell = select.options[select.selectedIndex]?.textContent.trim() || '';
        }
      }
    }

    // Frequency cell: select-wrapper (select)
    let frequencyCell = '';
    const selectWrapper = fields.find((f) => f.classList.contains('select-wrapper'));
    if (selectWrapper) {
      const select = selectWrapper.querySelector('select');
      if (select) {
        frequencyCell = select.options[select.selectedIndex]?.textContent.trim() || '';
      }
    }

    // Total cell: text-wrapper (input + label)
    let totalCell = '';
    const textWrappers = fields.filter((f) => f.classList.contains('text-wrapper'));
    if (textWrappers.length > 0) {
      // For the last row, there may be two text-wrappers (frequency total and yearly total)
      totalCell = textWrappers.map((tw) => {
        const label = tw.querySelector('label');
        return label ? label.textContent.trim() : '';
      }).filter(Boolean).join(' / ');
    }

    // Remove empty cells (for last row, don't add empty leading cell)
    const row = [labelCell, frequencyCell, totalCell].filter(cell => cell && cell.length > 0);
    return row.length ? row : null;
  }).filter(Boolean);

  // Compose the table rows (no extra header row)
  const tableRows = [headerRow, ...dataRows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
