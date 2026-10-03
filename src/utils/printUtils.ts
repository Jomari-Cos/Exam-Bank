/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Universal Print Utility for BSCpE Examination System
 *
 * Provides resilient, multi-strategy document printing:
 * 1. Isolated Offscreen Print Frame: Clones the designated element into a dedicated print context with full stylesheets,
 *    eliminating UI clutter (navbars, sidebars, headers, action buttons) without clipping or blank pages.
 *    NOTE: Chromium requires the iframe to have layout (non-zero width/height and opacity: 0 instead of visibility: hidden).
 * 2. Main Window Fallback: Applies isolation classes to the DOM target and document.body, ensuring only the target element
 *    renders on paper even when standard window.print() is used.
 */

export interface PrintOptions {
  documentTitle?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

/**
 * Helper to wait for DOM element to exist in case of recent tab switch / state update.
 */
function waitForElement(elementId: string, maxWaitMs = 600): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const existing = document.getElementById(elementId);
    if (existing) {
      return resolve(existing);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const el = document.getElementById(elementId);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - startTime >= maxWaitMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 50);
  });
}

/**
 * Print a designated HTML element by ID with typography and stylesheet preservation.
 */
export async function printElementById(elementId: string, options: PrintOptions = {}): Promise<boolean> {
  const { documentTitle, onBeforePrint, onAfterPrint } = options;
  
  // Wait up to 600ms for element to appear (e.g. after tab navigation)
  const element = await waitForElement(elementId);

  if (!element) {
    console.warn(`[printUtils] Element #${elementId} not found in DOM after wait.`);
    window.print();
    return false;
  }

  onBeforePrint?.();

  const originalTitle = document.title;
  if (documentTitle) {
    document.title = documentTitle;
  }

  // Strategy 1: Isolated Off-Screen Iframe (Full Isolation)
  try {
    // Remove any stale print iframes
    const staleIframes = document.querySelectorAll('iframe[data-print-frame="true"]');
    staleIframes.forEach((f) => f.remove());

    const printFrame = document.createElement('iframe');
    printFrame.setAttribute('data-print-frame', 'true');
    printFrame.setAttribute('aria-hidden', 'true');
    // Important for Chromium: Must have non-zero dimensions and opacity: 0 offscreen so Blink computes layout!
    printFrame.style.position = 'fixed';
    printFrame.style.left = '-10000px';
    printFrame.style.top = '0';
    printFrame.style.width = '1024px';
    printFrame.style.height = '1448px';
    printFrame.style.border = 'none';
    printFrame.style.opacity = '0';
    printFrame.style.pointerEvents = 'none';
    printFrame.style.zIndex = '-999';

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();

      // Collect external stylesheets and style blocks from current document
      const styleSheets = Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style')
      )
        .map((node) => node.outerHTML)
        .join('\n');

      const htmlContent = `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>${documentTitle || originalTitle}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
            ${styleSheets}
            <style>
              @page {
                size: A4 portrait;
                margin: 1.2cm;
              }
              *, *::before, *::after {
                box-sizing: border-box;
              }
              body {
                background: #ffffff !important;
                color: #0f172a !important;
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print {
                display: none !important;
              }
              .page-break-before {
                page-break-before: always !important;
                break-before: page !important;
              }
              .page-break-after {
                page-break-after: always !important;
                break-after: page !important;
              }
              .avoid-break {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              #exam-paper-container,
              #exam-answer-key-container,
              #exam-combined-print-container,
              #exam-tos-container,
              #exam-omr-container,
              #printable-question-card,
              #printable-audit-report {
                box-shadow: none !important;
                border: none !important;
                margin: 0 !important;
                padding: 0 !important;
                max-width: 100% !important;
                width: 100% !important;
                background: #ffffff !important;
              }
            </style>
          </head>
          <body>
            <div id="print-root">
              ${element.outerHTML}
            </div>
          </body>
        </html>
      `;

      frameDoc.write(htmlContent);
      frameDoc.close();

      const triggerPrint = () => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
          onAfterPrint?.();
        } catch (e) {
          console.warn('[printUtils] Frame print failed, falling back to window.print():', e);
          fallbackWindowPrint(element, originalTitle, documentTitle, onAfterPrint);
        } finally {
          if (documentTitle) {
            document.title = originalTitle;
          }
          setTimeout(() => {
            printFrame.remove();
          }, 3000);
        }
      };

      // Check if fonts are ready in iframe, then print
      if ((frameDoc as any).fonts && (frameDoc as any).fonts.ready) {
        (frameDoc as any).fonts.ready.then(() => {
          setTimeout(triggerPrint, 150);
        }).catch(() => {
          setTimeout(triggerPrint, 250);
        });
      } else {
        setTimeout(triggerPrint, 300);
      }
      return true;
    }
  } catch (err) {
    console.warn('[printUtils] Isolated print frame creation failed; using direct window.print:', err);
  }

  // Strategy 2: Resilient Main Window Fallback with Target Isolation
  fallbackWindowPrint(element, originalTitle, documentTitle, onAfterPrint);
  return true;
}

/**
 * Fallback to standard window.print() while applying isolation attributes to the target element.
 */
function fallbackWindowPrint(
  targetElement: HTMLElement,
  originalTitle: string,
  documentTitle?: string,
  onAfterPrint?: () => void
) {
  document.body.classList.add('is-printing-element');
  targetElement.setAttribute('data-print-active', 'true');

  try {
    window.print();
  } catch (err) {
    console.error('[printUtils] window.print() failed:', err);
  } finally {
    setTimeout(() => {
      document.body.classList.remove('is-printing-element');
      targetElement.removeAttribute('data-print-active');
      if (documentTitle) {
        document.title = originalTitle;
      }
      onAfterPrint?.();
    }, 1000);
  }
}
