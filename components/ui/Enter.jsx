/**
 * Load-time entrance: the element rises and fades into place once, on a
 * soft curve, after `delay` milliseconds.
 *
 * Pure CSS (`.enter` in globals.css), so it runs before hydration, needs no
 * JavaScript at all, and is switched off by prefers-reduced-motion and
 * ?nomotion — in every one of those cases the element simply renders in its
 * final state. Nothing is ever left invisible waiting on a script.
 *
 *   effect   'rise' (default) · 'fade' · 'scale'
 */
const EFFECT = { rise: 'enter', fade: 'enter-fade', scale: 'enter-scale' };

export default function Enter({ as: Tag = 'div', delay = 0, effect = 'rise', className = '', style, children, ...rest }) {
  return (
    <Tag className={`${EFFECT[effect] || EFFECT.rise} ${className}`} style={{ '--d': delay, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
