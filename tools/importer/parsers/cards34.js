/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the card content from a card wrapper
  function extractCard(cardDiv) {
    // Defensive: find the inner content div
    const innerDiv = cardDiv.querySelector('div');
    if (!innerDiv) return [null, null];

    // Find the image (picture element)
    const imgP = innerDiv.querySelector('p[data-aue-prop$="vehicle_image"]');
    let image = null;
    if (imgP) {
      image = imgP.querySelector('picture');
    }

    // Compose the text cell
    const textContent = document.createElement('div');
    // Title
    const badgeP = innerDiv.querySelector('p[data-aue-prop$="badge"]');
    if (badgeP) {
      const h3 = document.createElement('h3');
      h3.textContent = badgeP.textContent.trim();
      textContent.appendChild(h3);
    }
    // Description (car name)
    const descP = innerDiv.querySelector('p[data-aue-prop$="description"]');
    if (descP) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descP.textContent.trim();
      textContent.appendChild(descDiv);
    }
    // Price box
    const wrapperDiv = innerDiv.querySelector('.wrapper');
    if (wrapperDiv) {
      // Price
      const priceP = wrapperDiv.querySelector('p[data-aue-prop$="vehicle_price"]');
      const priceDescP = wrapperDiv.querySelector('p[data-aue-prop$="vehicle_price_description"]');
      if (priceP || priceDescP) {
        const priceBox = document.createElement('div');
        if (priceP) {
          const priceSpan = document.createElement('span');
          priceSpan.textContent = priceP.textContent.trim();
          priceBox.appendChild(priceSpan);
        }
        if (priceDescP) {
          const priceDescDiv = document.createElement('div');
          priceDescDiv.textContent = priceDescP.textContent.trim();
          priceBox.appendChild(priceDescDiv);
        }
        textContent.appendChild(priceBox);
      }
    }
    // Figure is based on
    const figureTitleP = innerDiv.querySelector('p[data-aue-prop$="figure_title"]');
    if (figureTitleP) {
      const figureDiv = document.createElement('div');
      figureDiv.textContent = figureTitleP.textContent.trim();
      textContent.appendChild(figureDiv);
    }
    // Salary
    const salaryTitleP = innerDiv.querySelector('p[data-aue-prop$="salary_title"]');
    const salaryValueP = innerDiv.querySelector('p[data-aue-prop$="salary_value"]');
    if (salaryTitleP && salaryValueP) {
      const salaryDiv = document.createElement('div');
      salaryDiv.textContent = `${salaryTitleP.textContent.trim()} ${salaryValueP.textContent.trim()}`;
      textContent.appendChild(salaryDiv);
    }
    // Car value
    const carTitleP = innerDiv.querySelector('p[data-aue-prop$="car_title"]');
    const carValueP = innerDiv.querySelector('p[data-aue-prop$="car_value"]');
    if (carTitleP && carValueP) {
      const carDiv = document.createElement('div');
      carDiv.textContent = `${carTitleP.textContent.trim()} ${carValueP.textContent.trim()}`;
      textContent.appendChild(carDiv);
    }
    return [image, textContent];
  }

  // Find both card wrappers
  const cards = [];
  const noOlyDiv = element.querySelector('.no-oly');
  if (noOlyDiv) {
    cards.push(extractCard(noOlyDiv));
  }
  const withOlyDiv = element.querySelector('.with-oly');
  if (withOlyDiv) {
    cards.push(extractCard(withOlyDiv));
  }

  // Compose table rows
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];
  cards.forEach(([image, textContent]) => {
    rows.push([image, textContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
