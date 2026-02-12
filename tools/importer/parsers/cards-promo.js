/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure:
 * - One row per promotional card (image | content)
 *
 * Source HTML Pattern (EXTRACTED from cleaned.html):
 * <div class="flex-cards aem-GridColumn">
 *   <div class="flex-card-main">
 *     <div class="row-of-cards">
 *       <div class="card-wrapper card_click">
 *         <div class="card flex-card">
 *           <img src="...">
 *           <div class="eyebrow-lg-desktop">New & existing customers</div>
 *           <h3>Get the new iPhone 17 Pro for $0</h3>
 *           <div class="type-base"><p>...</p></div>
 *           <div class="type-legal"><p>...</p></div>
 *           <a class="btn-primary">Shop now</a>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract promotional card wrappers
  // VALIDATED: Found <div class="card-wrapper card_click"> in DOM (line 1588)
  const cardWrappers = Array.from(element.querySelectorAll('.card-wrapper'));

  const cells = [];

  cardWrappers.forEach((wrapper) => {
    // Extract card background image
    // VALIDATED: Found <img src="..."> directly in card div (line 1590)
    const img = wrapper.querySelector('.card > img') ||
                wrapper.querySelector('.flex-card > img') ||
                wrapper.querySelector('img');

    // Extract eyebrow
    // VALIDATED: Found <div class="eyebrow-lg-desktop"> (line 1594)
    const eyebrowEl = wrapper.querySelector('[class*="eyebrow-lg-"]') ||
                      wrapper.querySelector('[class*="eyebrow-"]');

    // Extract heading
    // VALIDATED: Found <h3 class="heading-lg-desktop"> (line 1597)
    const heading = wrapper.querySelector('h3') || wrapper.querySelector('h2');

    // Extract body text
    // VALIDATED: Found <div class="type-base"><p>...</p></div> (line 1600)
    const bodyEl = wrapper.querySelector('.type-base:not(.body-text)');

    // Extract legal text
    // VALIDATED: Found <div class="type-legal"><p>...</p></div> (line 1603)
    const legalEl = wrapper.querySelector('.type-legal');

    // Extract CTA
    // VALIDATED: Found <a class="btn-primary att-track" href="...">Shop now</a> (line 1608)
    const cta = wrapper.querySelector('a.btn-primary') ||
                wrapper.querySelector('.flexCardItemCta a') ||
                wrapper.querySelector('a[class*="btn-"]');

    // Build image cell
    const imgCell = [];
    if (img) {
      imgCell.push(img.cloneNode(true));
    }

    // Build content cell
    const contentCell = [];
    if (eyebrowEl) {
      const eyebrowP = document.createElement('p');
      eyebrowP.textContent = eyebrowEl.textContent.trim();
      contentCell.push(eyebrowP);
    }
    if (heading) {
      contentCell.push(heading.cloneNode(true));
    }
    if (bodyEl) {
      contentCell.push(bodyEl.cloneNode(true));
    }
    if (legalEl) {
      contentCell.push(legalEl.cloneNode(true));
    }
    if (cta) {
      contentCell.push(cta.cloneNode(true));
    }

    cells.push([imgCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Promo', cells });
  element.replaceWith(block);
}
