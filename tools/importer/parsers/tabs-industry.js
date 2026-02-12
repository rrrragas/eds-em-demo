/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-industry block
 *
 * Source: https://www.business.att.com/
 * Base Block: tabs
 *
 * Block Structure:
 * - Row per tab: tab label | tab content (icon, image, description, link)
 *
 * Source HTML Pattern (EXTRACTED from cleaned.html):
 * <div class="story-stack aem-GridColumn">
 *   <div class="ss-wrapper">
 *     <div class="ss-masterHeader">Solutions for every kind of business</div>
 *     <div class="ss-visual-img-wrapper">
 *       <div class="swiper storyStackSlider">
 *         <div class="swiper-wrapper">
 *           <div class="swiper-slide">
 *             <div class="story-img-wrapper">
 *               <img class="story-icon-img is-icon" src="...">
 *               <img class="swiper-image" src="...">
 *             </div>
 *             <div class="story-content-slider">
 *               <div class="heading-sm-storyStack">Small business</div>
 *               <div class="story-description"><p>...</p></div>
 *               <div class="story-arrow-next"><img src="..."></div>
 *             </div>
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
  // Extract tab slides
  // VALIDATED: Found <div class="swiper-slide"> inside storyStackSlider (line 2000)
  const slides = Array.from(element.querySelectorAll('.storyStackSlider .swiper-slide'));

  const cells = [];

  slides.forEach((slide) => {
    // Extract tab label/heading
    // VALIDATED: Found <div class="heading-sm heading-sm-storyStack">Small business</div> (line 2013)
    const labelEl = slide.querySelector('[class*="heading-sm-storyStack"]') ||
                    slide.querySelector('.heading-sm');
    const label = labelEl ? labelEl.textContent.trim() : '';

    // Extract icon image
    // VALIDATED: Found <img class="story-icon-img is-icon" src="..."> (line 2006)
    const iconImg = slide.querySelector('.story-icon-img') ||
                    slide.querySelector('.is-icon');

    // Extract main slide image
    // VALIDATED: Found <img class="swiper-image" src="..."> (line 2008)
    const slideImg = slide.querySelector('.swiper-image') ||
                     slide.querySelector('.story-img-container img:not(.is-icon)');

    // Extract description
    // VALIDATED: Found <div class="story-description"><p>...</p></div> (line 2016)
    const descEl = slide.querySelector('.story-description') ||
                   slide.querySelector('.type-base.wysiwyg-editor');

    // Extract CTA link from story-arrow-next or direct link
    // VALIDATED: Found <div class="story-arrow-next"> with image links
    const ctaLink = slide.querySelector('a[class*="att-track"]') ||
                    slide.querySelector('.story-content-slider a');

    // Build tab label cell
    const labelCell = [];
    const labelP = document.createElement('p');
    labelP.textContent = label;
    labelCell.push(labelP);

    // Build tab content cell
    const contentCell = [];
    if (iconImg) {
      contentCell.push(iconImg.cloneNode(true));
    }
    if (slideImg) {
      contentCell.push(slideImg.cloneNode(true));
    }
    if (descEl) {
      contentCell.push(descEl.cloneNode(true));
    }
    if (ctaLink) {
      contentCell.push(ctaLink.cloneNode(true));
    }

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Industry', cells });
  element.replaceWith(block);
}
