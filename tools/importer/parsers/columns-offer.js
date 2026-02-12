/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-offer block
 *
 * Source: https://www.business.att.com/
 * Base Block: columns
 *
 * Block Structure:
 * - Single row with 2 columns (image | content)
 *
 * Source HTML Pattern (EXTRACTED from cleaned.html):
 * <div class="offer aem-GridColumn">
 *   <div class="left-alignment">
 *     <div class="row flex-items-center order-changed-onlyMobile">
 *       <div class="grid-col-6 order-img-top">
 *         <img src="..." class="imgOffer">
 *       </div>
 *       <div class="grid-col-6">
 *         <div class="eyebrow-xxl-desktop">Switch. Save. Soar.</div>
 *         <h2>Make the switch to AT&T Business</h2>
 *         <div class="type-base wysiwyg-editor"><p>... Get perks like:</p>
 *           <ul class="chkmrk"><li>...</li></ul>
 *         </div>
 *         <a class="btn-primary">Learn more</a>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract image
  // VALIDATED: Found <img class="imgOffer"> in offer section (line 1912)
  const img = element.querySelector('.imgOffer') ||
              element.querySelector('.video-modal-target img') ||
              element.querySelector('.order-img-top img') ||
              element.querySelector('.grid-col-6 img');

  // Extract eyebrow
  // VALIDATED: Found <div class="eyebrow-xxl-desktop">Switch. Save. Soar.</div> (line 1922)
  const eyebrowEl = element.querySelector('[class*="eyebrow-xxl-desktop"]') ||
                    element.querySelector('[class*="eyebrow-"]');

  // Extract heading
  // VALIDATED: Found <h2 class="heading-xxl-desktop">Make the switch...</h2> (line 1925)
  const heading = element.querySelector('h2') || element.querySelector('h1');

  // Extract body text with checklist
  // VALIDATED: Found <div class="type-base wysiwyg-editor"> with <ul class="chkmrk"> (lines 1928-1954)
  const bodyEl = element.querySelector('.type-base.wysiwyg-editor') ||
                 element.querySelector('.type-base');

  // Extract CTA
  // VALIDATED: Found <a class="btn-primary att-track">Learn more</a> (line 1966)
  const cta = element.querySelector('.cta-container a.btn-primary') ||
              element.querySelector('a.btn-primary');

  // Build image column
  const imgCol = [];
  if (img) {
    imgCol.push(img.cloneNode(true));
  }

  // Build content column
  const contentCol = [];
  if (eyebrowEl) {
    const eyebrowP = document.createElement('p');
    eyebrowP.textContent = eyebrowEl.textContent.trim();
    contentCol.push(eyebrowP);
  }
  if (heading) {
    contentCol.push(heading.cloneNode(true));
  }
  if (bodyEl) {
    contentCol.push(bodyEl.cloneNode(true));
  }
  if (cta) {
    contentCol.push(cta.cloneNode(true));
  }

  const cells = [
    [imgCol, contentCol],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Offer', cells });
  element.replaceWith(block);
}
