/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure:
 * - One row per card (image | content)
 *
 * Source HTML Pattern (EXTRACTED from cleaned.html):
 * <div class="multi-tile-cards aem-GridColumn">
 *   <div class="multi-tile-main">
 *     <div class="eyebrow-heading-body">
 *       <h2>Fast, reliable, and secure</h2>
 *       <div class="type-base multi-cta-body"><p>...</p></div>
 *     </div>
 *     <div class="multi-tile-row swiper-wrapper">
 *       <div class="tile-card swiper-slide">
 *         <div class="card">
 *           <div class="card-img"><img src="..."></div>
 *           <div class="card-content">
 *             <h3>Mobile</h3>
 *             <div class="tileSubheading"><p>...</p></div>
 *             <div class="price-variation">...</div>
 *             <a href="..." class="att-track">Learn more</a>
 *           </div>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract individual tile cards
  // VALIDATED: Found <div class="tile-card ... swiper-slide"> in DOM (line 1314)
  const tiles = Array.from(element.querySelectorAll('.tile-card'));

  const cells = [];

  tiles.forEach((tile) => {
    // Extract card image
    // VALIDATED: Found <div class="card-img"><img> (line 1316)
    const img = tile.querySelector('.card-img img') || tile.querySelector('img');

    // Extract card title
    // VALIDATED: Found <h3 class="heading-md js-heading-section">Mobile</h3> (line 1323)
    const title = tile.querySelector('h3') || tile.querySelector('h4');

    // Extract card body text
    // VALIDATED: Found <div class="tileSubheading"><p>...</p></div> (line 1326)
    const bodyEl = tile.querySelector('.tileSubheading') ||
                   tile.querySelector('.js-textBody-section');

    // Extract price info
    // VALIDATED: Found <div class="price-variation"> with price details (line 1331)
    const priceEl = tile.querySelector('.price-variation');
    let priceText = '';
    if (priceEl) {
      const priceDesc = priceEl.querySelector('.price-description');
      const priceAmount = priceEl.querySelector('.price-amount-qty');
      if (priceDesc && priceAmount) {
        priceText = `${priceDesc.textContent.trim()} **${priceAmount.textContent.trim()}**`;
      }
    }

    // Extract legal/sub-price text
    // VALIDATED: Found price-per-line-text spans in tile cards
    const legalSpan = tile.querySelector('.price-per-line-text') ||
                      tile.querySelector('.type-legal');

    // Extract CTA link
    // VALIDATED: Found <a href="..." class="att-track"> at bottom of card (various)
    const cta = tile.querySelector('a[class*="att-track"]') ||
                tile.querySelector('.card-content a');

    // Build image cell
    const imgCell = [];
    if (img) {
      imgCell.push(img.cloneNode(true));
    }

    // Build content cell
    const contentCell = [];
    if (title) {
      contentCell.push(title.cloneNode(true));
    }
    if (bodyEl) {
      contentCell.push(bodyEl.cloneNode(true));
    }
    if (priceText) {
      const priceP = document.createElement('p');
      priceP.innerHTML = priceText;
      contentCell.push(priceP);
    }
    if (legalSpan) {
      const legalP = document.createElement('p');
      legalP.textContent = legalSpan.textContent.trim();
      contentCell.push(legalP);
    }
    if (cta) {
      contentCell.push(cta.cloneNode(true));
    }

    cells.push([imgCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Product', cells });
  element.replaceWith(block);
}
