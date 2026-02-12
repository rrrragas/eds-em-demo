/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-links block
 *
 * Source: https://www.business.att.com/
 * Base Block: columns
 *
 * Block Structure:
 * - Single row with 4 columns, each containing a list of links
 *
 * Source HTML Pattern (EXTRACTED from cleaned.html):
 * <div class="link-farm aem-GridColumn">
 *   <div class="link-farm-main">
 *     <div class="desktop-view-and-tablet">
 *       <div class="row justify-center">
 *         <div class="grid-col-3 accordion-item desktop-divice">
 *           <ul class="accordion-panel nocolheading">
 *             <li><a href="..." class="Grey att-track link-text2">Business wireless</a></li>
 *             <li><a href="...">Business phone deals</a></li>
 *             ...
 *           </ul>
 *         </div>
 *         (repeated 4 times for 4 columns)
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract link columns from desktop view
  // VALIDATED: Found <div class="grid-col-3 ... accordion-item desktop-divice"> (line 2457)
  // Use desktop view to get the 4-column layout
  const desktopView = element.querySelector('.desktop-view-and-tablet');
  const sourceEl = desktopView || element;

  const columns = Array.from(sourceEl.querySelectorAll('.grid-col-3.accordion-item'));

  // Build single row with all columns
  const row = [];

  columns.forEach((col) => {
    // Extract all links in this column
    // VALIDATED: Found <ul class="accordion-panel"><li><a href="..." class="link-text2">...</a></li> (line 2458)
    const links = Array.from(col.querySelectorAll('ul.accordion-panel li a'));

    const colContent = [];

    // Build a list of links for this column
    const ul = document.createElement('ul');
    links.forEach((link) => {
      const li = document.createElement('li');
      const a = link.cloneNode(true);
      // Clean up tracking classes
      a.removeAttribute('class');
      li.appendChild(a);
      ul.appendChild(li);
    });

    colContent.push(ul);
    row.push(colContent);
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Links', cells });
  element.replaceWith(block);
}
