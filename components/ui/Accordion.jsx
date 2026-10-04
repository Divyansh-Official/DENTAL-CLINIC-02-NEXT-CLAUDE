import Icon from './Icon';

/**
 * Disclosure list built on native <details>/<summary>.
 *
 * It works with JavaScript off, is announced correctly by every screen
 * reader, and Ctrl-F finds text inside closed answers. Items sharing a
 * `group` name behave as an exclusive accordion where the browser supports
 * it; the height animates where `::details-content` is supported and simply
 * toggles elsewhere.
 */
export default function Accordion({ items = [], group, className = '', defaultOpen = 0 }) {
  const list = (Array.isArray(items) ? items : []).filter((item) => item?.q);
  if (!list.length) return null;

  return (
    <div className={className}>
      {list.map((item, index) => (
        <details key={`${item.q}-${index}`} name={group} className="disclosure" open={index === defaultOpen || undefined}>
          <summary>
            <span>{item.q}</span>
            <span className="disclosure-icon" aria-hidden="true">
              <Icon name="plus" size={15} strokeWidth={2} />
            </span>
          </summary>
          <p className="t-body max-w-3xl pb-6 pr-10">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
