/**
 * Hairline reading indicator along the top edge, driven entirely by a CSS
 * scroll timeline (`.scroll-progress` in globals.css) — no JavaScript, no
 * scroll listener. Where scroll timelines are unsupported it stays hidden.
 */
export default function ScrollProgress() {
  return <div className="scroll-progress" aria-hidden="true" />;
}
