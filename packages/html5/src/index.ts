import LaTeX2JS from 'latex2js';
import { getMathJax, loadMathJax } from 'mathjaxjs';
import pspicture from './components/pspicture.js';
import nicebox from './components/nicebox.js';
import enumerate from './components/enumerate.js';
import verbatim from './components/verbatim.js';
import math from './components/math.js';
import macros from './components/macros';

const ELEMENTS = { pspicture, nicebox, enumerate, verbatim, math, macros };

export { pspicture, nicebox, enumerate, verbatim, math, macros };

/**
 * Renders LaTeX content to HTML using callback pattern.
 *
 * This function parses LaTeX text and renders it to a div element. It ensures MathJax
 * is loaded before rendering and calls the resolve callback with the rendered div.
 *
 * ⚠️ **Known Issues:**
 * 1. **Does not wait for MathJax processing**: This function returns immediately after
 *    rendering DOM elements, without waiting for MathJax to process mathematical expressions.
 *    The returned div may contain unprocessed LaTeX code (e.g., `$...$` or `$$...$$`).
 *
 * 2. **Inconsistent behavior**: Unlike `renderAsync` and `renderPromise`, this function
 *    does not wait for MathJax typesetting to complete, leading to inconsistent behavior
 *    across different rendering methods.
 *
 * 3. **Possible race conditions**: If MathJax is still loading, concurrent calls may
 *    result in unprocessed mathematical content.
 *
 * 4. **No error handling**: There is no error handling mechanism, making it difficult
 *    to detect rendering failures.
 *
 * 💡 **Recommendation**: For reliable rendering with processed mathematical expressions,
 * use `renderAsync` or `renderPromise` instead, which wait for MathJax processing to complete.
 *
 * @param tex - LaTeX content string to render
 * @param resolve - Callback function that receives the rendered HTMLDivElement
 *                  Note: The div may contain unprocessed LaTeX if MathJax hasn't finished processing
 *
 * @example
 * ```typescript
 * render('$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', (div) => {
 *   document.body.appendChild(div);
 *   // ⚠️ Warning: MathJax may not have finished processing the math expressions yet
 * });
 * ```
 */
export function render(tex: string, resolve: (div: HTMLDivElement) => void): void {
  const done = () => {
    const latex = new LaTeX2JS();
    const parsed = latex.parse(tex);
    const div = document.createElement('div');
    div.className = 'latex-container';
    parsed &&
      parsed.forEach &&
      parsed.forEach((el: any) => {
        if (ELEMENTS.hasOwnProperty(el.type)) {
          const elementType = el.type as keyof typeof ELEMENTS;
          div.appendChild(ELEMENTS[elementType](el));
        }
      });
    resolve(div);
  };

  if (getMathJax()) {
    return done();
  }
  loadMathJax(done);
}

const ensureMathJax = (): Promise<void> => {
  return new Promise((resolve) => {
    if (getMathJax()) {
      resolve();
      return;
    }
    loadMathJax(() => {
      resolve();
    });
  });
};

const renderElements = (tex: string): HTMLDivElement => {
  const latex = new LaTeX2JS();
  const parsed = latex.parse(tex);
  const div = document.createElement('div');
  div.className = 'latex-container';
  parsed &&
    parsed.forEach &&
    parsed.forEach((el: any) => {
      if (ELEMENTS.hasOwnProperty(el.type)) {
        const elementType = el.type as keyof typeof ELEMENTS;
        div.appendChild(ELEMENTS[elementType](el));
      }
    });
  return div;
};

const waitForMathJax = (div: HTMLDivElement): Promise<void> => {
  return new Promise((mathJaxResolve) => {
    const mathJax = getMathJax();
    if (mathJax && mathJax.typesetPromise) {
      mathJax.typesetPromise([div])
        .then(() => {
          mathJaxResolve();
        })
        .catch((err: any) => {
          console.warn('MathJax typesetting failed:', err);
          mathJaxResolve();
        });
    } else {
      mathJaxResolve();
    }
  });
};

/**
 * Renders LaTeX content to HTML using async/await pattern.
 *
 * This function parses LaTeX text and renders it to a div element. It ensures MathJax
 * is loaded and waits for all mathematical expressions to be processed before returning.
 *
 * @param tex - LaTeX content string to render
 * @returns Promise that resolves to the rendered HTMLDivElement with all MathJax processing complete
 *
 * @example
 * ```typescript
 * const div = await renderAsync('$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$');
 * document.body.appendChild(div);
 * ```
 */
export async function renderAsync(tex: string): Promise<HTMLDivElement> {
  await ensureMathJax();
  const div = renderElements(tex);
  await waitForMathJax(div);
  return div;
}

/**
 * Renders LaTeX content to HTML using Promise chain pattern (without async/await).
 *
 * This function parses LaTeX text and renders it to a div element. It ensures MathJax
 * is loaded and waits for all mathematical expressions to be processed before resolving.
 * Uses Promise chain instead of async/await for environments that don't support async syntax.
 *
 * @param tex - LaTeX content string to render
 * @param container - DOM node to append the rendered div to. Must be a valid Node that can have children appended.
 * @returns Promise that resolves to the rendered HTMLDivElement with all MathJax processing complete
 *
 * @example
 * ```typescript
 * // Append to body
 * renderPromise('$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', document.body)
 *   .then(div => {
 *     console.log('Rendered and appended:', div);
 *   });
 *
 * // Append to specific element
 * const targetElement = document.getElementById('math-container');
 * renderPromise('$E = mc^2$', targetElement);
 * ```
 */
export function renderPromise(tex: string, container: Node): Promise<HTMLDivElement> {
  if (!container) {
    return Promise.reject(new Error('Container node is required'));
  }

  if (!container.appendChild) {
    return Promise.reject(new Error('Container must be a valid DOM node that supports appendChild'));
  }

  return ensureMathJax()
    .then(() => {
      const div = renderElements(tex);
      container.appendChild(div);
      return waitForMathJax(div).then(() => div);
    })
    .catch((err) => {
      console.error('Render failed:', err);
      const div = document.createElement('div');
      div.className = 'latex-container';
      container.appendChild(div);
      return div;
    });
}

/**
 * Initializes LaTeX2JS by automatically discovering and rendering LaTeX content.
 *
 * This function loads MathJax and automatically finds all `<script type="text/latex">` elements
 * in the document, rendering their content and inserting the result after each script tag.
 *
 * @example
 * ```html
 * <script type="text/latex">
 * $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
 * </script>
 * <script>
 *   init(); // Automatically renders the LaTeX content above
 * </script>
 * ```
 */
export const init = (): void => {
  loadMathJax();
  document.querySelectorAll('script[type="text/latex"]').forEach((el) => {
    render(el.innerHTML, (div: HTMLDivElement) => {
      if (el.parentNode) {
        el.parentNode.insertBefore(div, el.nextSibling);
      }
    });
  });
};
