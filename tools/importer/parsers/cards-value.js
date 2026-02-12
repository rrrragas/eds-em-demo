/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-value block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure:
 * - One row per value proposition card (icon image | content)
 *
 * Source HTML Pattern (EXTRACTED from cleaned.html):
 * <div class="generic-list-value-prop aem-GridColumn">
 *   <div class="generic-list-icon-vp-row">
 *     <div class="generic-list-icon-vp">
 *       <div class="flex-column">
 *         <span><img src="..." alt=""></span>
 *         <h4 class="heading-md">The AT&T Guarantee</h4>
 *         <div class="description type-sm"><p>...</p></div>
 *         <div class="type-legal"><p>...</p></div>
 *       </div>
 *       <a class="primary-cta att-track">Learn more</a>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract value proposition items
  // VALIDATED: Found <div class="generic-list-icon-vp"> in DOM (lines 1758, 1780, 1798, 1816)
  const vpItems = Array.from(element.querySelectorAll('.generic-list-icon-vp'));

  const cells = [];

  vpItems.forEach((item) => {
    // Extract icon image
    // VALIDATED: Found <span class="height-xl-all width-xl-all"><img> (line 1760)
    const icon = item.querySelector('.height-xl-all img') ||
                 item.querySelector('span img') ||
                 item.querySelector('img');

    // Extract title
    // VALIDATED: Found <h4 class="heading-md">The AT&T Guarantee</h4> (line 1763)
    const title = item.querySelector('h4') ||
                  item.querySelector('h3') ||
                  item.querySelector('[class*="heading-"]');

    // Extract description
    // VALIDATED: Found <div class="description type-sm"><p>...</p></div> (line 1766)
    const descEl = item.querySelector('.description') ||
                   item.querySelector('.type-sm');

    // Extract legal text
    // VALIDATED: Found <div class="type-legal type-legal-wysiwyg-editor"><p>...</p></div> (line 1769)
    const legalEl = item.querySelector('.type-legal');

    // Extract CTA
    // VALIDATED: Found <a class="primary-cta att-track">Learn more</a> (line 1775)
    const cta = item.querySelector('a.primary-cta') ||
                item.querySelector('a[class*="cta"]') ||
                item.querySelector('a.att-track');

    // Build image cell
    const imgCell = [];
    if (icon) {
      imgCell.push(icon.cloneNode(true));
    }

    // Build content cell
    const contentCell = [];
    if (title) {
      contentCell.push(title.cloneNode(true));
    }
    if (descEl) {
      contentCell.push(descEl.cloneNode(true));
    }
    if (legalEl) {
      contentCell.push(legalEl.cloneNode(true));
    }
    if (cta) {
      contentCell.push(cta.cloneNode(true));
    }

    cells.push([imgCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Value', cells });
  element.replaceWith(block);
}
