/**
 * Scroll-driven reveal: the element rises into place as it scrolls into
 * view, driven by a CSS view timeline — no JavaScript, no observers, no
 * hydration concerns.
 *
 * Browsers without view timelines (Firefox, Safari before 26) and visitors
 * who prefer reduced motion simply see the content. `index` staggers items
 * in a row by lengthening their range a little.
 *
 * Keep hover transforms on a child, not on this element: the reveal owns
 * this element's transform.
 */
export default function Reveal({ as: Tag = 'div', index = 0, effect = 'rise', className = '', style, children, ...rest }) {
  return (
    <Tag
      data-reveal={effect === 'fade' ? 'fade' : ''}
      className={className || undefined}
      style={index ? { '--ri': index, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
