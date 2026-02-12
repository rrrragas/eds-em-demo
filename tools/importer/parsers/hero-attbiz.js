/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-attbiz block
 *
 * Source: https://www.business.att.com/
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (eyebrow, heading, body, legal, CTAs)
 *
 * Source HTML Pattern (EXTRACTED from cleaned.html):
 * <div class="hero aem-GridColumn">
 *   <div class="hero-panel hero-wrapper">
 *     <div class="bg-hero-panel"><img src="..."></div>  (desktop bg)
 *     <div class="content-panel-text">
 *       <div class="eyebrow-lg-desktop">AT&T Business</div>
 *       <h2>Give your team an edge</h2>
 *       <div class="type-base wysiwyg-editor"><p>...</p></div>
 *       <div class="type-legal-wysiwyg-editor"><p>...</p></div>
 *       <div class="cta-container"><a class="btn-primary">...</a><a class="btn-secondary">...</a></div>
 *     </div>
 *     <div class="hero-panel-image"><img src="..."></div>  (mobile)
 *   </div>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract desktop background image
  // VALIDATED: Found <div class="bg-hero-panel"><img> in DOM (lines 1244, 1687)
  const bgImg = element.querySelector('.bg-hero-panel img') ||
                element.querySelector('.bg-art img');

  // Extract eyebrow text
  // VALIDATED: Found <div class="mar-b-xxs eyebrow-lg-desktop"> in DOM (line 1254)
  const eyebrowEl = element.querySelector('[class*="eyebrow-lg-desktop"]') ||
                    element.querySelector('[class*="eyebrow-xxxl-desktop"]') ||
                    element.querySelector('[class*="eyebrow-xxl-desktop"]');

  // Extract heading
  // VALIDATED: Found <h2 class="heading-xxl-desktop"> in DOM (line 1257)
  const heading = element.querySelector('h2[class*="heading-"]') ||
                  element.querySelector('h1[class*="heading-"]') ||
                  element.querySelector('h2') ||
                  element.querySelector('h1');

  // Extract body text
  // VALIDATED: Found <div class="type-base wysiwyg-editor"><p>...</p></div> (line 1260)
  const bodyEl = element.querySelector('.type-base.wysiwyg-editor') ||
                 element.querySelector('.type-base');

  // Extract checklist if present
  // VALIDATED: Found <ul class="chkmrk"> in hero sections (similar to offer section pattern)
  const checklistEl = element.querySelector('.chkmrk, .listwrapper ul');

  // Extract legal text
  // VALIDATED: Found <div class="type-legal-wysiwyg-editor"> in DOM (line 1713)
  const legalEl = element.querySelector('.type-legal-wysiwyg-editor') ||
                  element.querySelector('.type-legal');

  // Extract CTAs
  // VALIDATED: Found <div class="cta-container"><a class="btn-primary">...</a></div> (line 1716)
  const ctas = Array.from(element.querySelectorAll('.cta-container a.btn-primary, .cta-container a.btn-secondary'));

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

  if (checklistEl) {
    contentCell.push(checklistEl.cloneNode(true));
  }

  if (legalEl) {
    contentCell.push(legalEl.cloneNode(true));
  }

  ctas.forEach((cta) => {
    contentCell.push(cta.cloneNode(true));
  });

  // Build cells array
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImg) {
    cells.push([bgImg.cloneNode(true)]);
  }

  // Row 2: Content
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Attbiz', cells });
  element.replaceWith(block);
}
