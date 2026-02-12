/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-banner block
 *
 * Source: https://www.business.att.com/
 * Base Block: carousel
 *
 * Block Structure:
 * - One row per slide (content)
 *
 * Source HTML Pattern (EXTRACTED from cleaned.html):
 * <div class="micro-banner aem-GridColumn">
 *   <div class="micro-banner-main">
 *     <div class="banner-section swiper">
 *       <div class="swiper-wrapper">
 *         <div class="swiper-slide">
 *           <div class="content-section">
 *             <div class="heading-section"><p><b>Try AT&T Business for 30 days</b></p></div>
 *             <div class="body-text"><p>... <a href="...">Learn more</a></p></div>
 *             <div class="legal-container"><div class="legal-text"><p>...</p></div></div>
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
  // Extract carousel slides
  // VALIDATED: Found <div class="swiper-slide"> in micro-banner (lines 1852, 1873)
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));

  const cells = [];

  slides.forEach((slide) => {
    // Extract heading
    // VALIDATED: Found <div class="heading-section"><p><b>Try AT&T Business...</b></p></div> (line 1854)
    const headingEl = slide.querySelector('.heading-section');

    // Extract body text with CTA link
    // VALIDATED: Found <div class="type-base body-text"><p>...<a>Learn more</a></p></div> (line 1859)
    const bodyEl = slide.querySelector('.body-text') ||
                   slide.querySelector('.type-base');

    // Extract legal text
    // VALIDATED: Found <div class="legal-text"><p>...</p></div> (line 1865)
    const legalEl = slide.querySelector('.legal-text') ||
                    slide.querySelector('.type-legal');

    // Build slide content cell
    const contentCell = [];
    if (headingEl) {
      contentCell.push(headingEl.cloneNode(true));
    }
    if (bodyEl) {
      contentCell.push(bodyEl.cloneNode(true));
    }
    if (legalEl) {
      contentCell.push(legalEl.cloneNode(true));
    }

    cells.push(contentCell);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel-Banner', cells });
  element.replaceWith(block);
}
