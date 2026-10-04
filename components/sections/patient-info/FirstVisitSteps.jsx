import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';

/** Patient info: what to bring and expect on a first visit, as numbered tiles. */
export default function FirstVisitSteps({ eyebrow, title, accent, steps = [] }) {
  if (!steps.length) return null;

  return (
    <section className="tone-white section pt-0">
      <div className="shell">
        <SectionHeader eyebrow={eyebrow} title={title} accent={accent} />
        <ol className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title} index={index} className="tile flex flex-col bg-tile p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="icon-tile" style={{ '--s': '46px' }}>
                  <Icon name={step.icon} size={22} />
                </span>
                <span className="text-[28px] font-semibold tracking-[-0.04em] text-fg/15">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="t-headline mt-6 text-[19px]">{step.title}</h3>
              <p className="t-small mt-2">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
