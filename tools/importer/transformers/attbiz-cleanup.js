/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for AT&T Business website cleanup
 * Purpose: Remove non-content elements and fix HTML issues
 * Applies to: www.business.att.com (all templates)
 * Generated: 2026-02-12
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page-structure.json
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation header
    // EXTRACTED: Found <nav> and header elements in captured DOM (lines 1-1230)
    WebImporter.DOMUtils.remove(element, [
      'nav',
      'header',
      '.att-header',
      '#att-header',
    ]);

    // Remove footer
    // EXTRACTED: Found footer section in captured DOM (line 2807+)
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.footer',
      '.att-footer',
    ]);

    // Remove lead generation form section (complex form, handled as default content)
    // EXTRACTED: Found <div class="rai-form aem-GridColumn"> in captured DOM (line 2246)
    WebImporter.DOMUtils.remove(element, [
      'div.rai-form.aem-GridColumn',
    ]);

    // Remove chat widgets and overlays
    // EXTRACTED: Found chat/modal elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.chat-widget',
      '.bs-modal',
      '.modal-backdrop',
      '#defined-chat',
    ]);

    // Remove swiper navigation buttons (not content)
    // EXTRACTED: Found <div class="swipeButton swiper-button-prev"> in captured DOM (line 1893)
    WebImporter.DOMUtils.remove(element, [
      '.swipeButton',
      '.swiper-button-prev',
      '.swiper-button-next',
      '.swiper-pagination',
      '.swiper-notification',
    ]);

    // Remove empty price-comp and timer wrappers
    // EXTRACTED: Found empty <div class="price-comp-wrapper"> in hero sections (lines 1263, 1707)
    WebImporter.DOMUtils.remove(element, [
      '.price-comp-wrapper',
      '.timer',
    ]);

    // Remove hidden-spoken accessibility divs (content duplicated as visible text)
    // EXTRACTED: Found <div class="hidden-spoken"> in multi-tile cards (line 1333)
    WebImporter.DOMUtils.remove(element, [
      '.hidden-spoken',
    ]);

    // Re-enable scrolling if hidden
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove tracking attributes
    // EXTRACTED: Found data-track, onclick, att-track classes in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-lpos');
      el.removeAttribute('data-sname');
      el.removeAttribute('onclick');
    });

    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Remove empty divs that had background styling only
    // EXTRACTED: Found empty <div class="absolute-fill overflow-hidden"> wrappers (lines 1286, 1570)
    const emptyDivs = element.querySelectorAll('.absolute-fill');
    emptyDivs.forEach((div) => {
      if (!div.textContent.trim() && !div.querySelector('img')) {
        div.remove();
      }
    });

    // Remove empty max-width-background spacer divs
    // EXTRACTED: Found empty <div class="max-width-background"> (lines 1238, 1278)
    const spacerDivs = element.querySelectorAll('.max-width-background');
    spacerDivs.forEach((div) => {
      if (!div.textContent.trim() && !div.querySelector('img') && !div.querySelector('a')) {
        div.remove();
      }
    });
  }
}
