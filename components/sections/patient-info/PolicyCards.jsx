import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';

/**
 * Patient info: the privacy policy and terms, each with an anchor id so the
 * footer's legal links land on them directly.
 */
export default function PolicyCards({ eyebrow, policies = [] }) {
  if (!policies.length) return null;

  return (
    <section className="tone-gray section">
      <div className="shell">
        {eyebrow ? <Reveal as="p" className="t-eyebrow text-center">{eyebrow}</Reveal> : null}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {policies.map((policy, index) => (
            <Reveal as="article" key={policy.id || policy.title} index={index} id={policy.id} className="tile scroll-mt-28 bg-tile p-7 sm:p-9">
              <span className="icon-tile icon-tile-soft" style={{ '--s': '44px' }}>
                <Icon name={policy.id === 'privacy' ? 'shield' : 'clipboard'} size={21} />
              </span>
              <h2 className="t-title mt-6 text-[clamp(1.4rem,1.2rem+0.8vw,1.9rem)]">{policy.title}</h2>
              <p className="t-body mt-4">{policy.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
