/**
 * The copyright year shown in the footers.
 *
 * Resolved once, at module load during the build's static render — not
 * per-request — so every page's footer bakes in the same year the client
 * bundle was built with. Import it only from server layouts and pass it to
 * the footer as a prop; never import it from a client component, where
 * `new Date()` would reflect the visitor's clock and cause a hydration
 * mismatch once the calendar year turns over.
 */
export const BUILD_YEAR: number = new Date().getFullYear();
