import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';

/**
 * The treatment journey as an ordered list: a timeline down the left edge on
 * a phone, a row joined by a hairline on wide screens. Any number of steps.
 */
export default function ProcessSteps({ steps = [], eyebrow, title, accent, tone = 'tone-gray' }) {
  if (!steps.length) return null;
  const cols = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' }[Math.min(steps.length, 6)] || 'lg:grid-cols-4';

  return (
    <section className={`${tone} section`}>
      <div className="shell">
        <SectionHeader eyebrow={eyebrow} title={title} accent={accent} />
        <div className="relative mt-14 lg:mt-16">
          <span
            className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-primary/40 via-accent/40 to-transparent lg:bottom-auto lg:left-[8%] lg:right-[8%] lg:top-[27px] lg:h-px lg:w-auto lg:bg-gradient-to-r"
            aria-hidden="true"
          />
          <ol className={`relative grid grid-cols-1 gap-8 lg:gap-6 ${cols}`}>
            {steps.map((step, index) => (
              <Reveal as="li" key={step.title} index={index} className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span className="sheen relative grid h-14 w-14 flex-none place-items-center rounded-full text-primary">
                  <Icon name={step.icon} size={23} />
                  <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-on-primary">
                    {step.step || index + 1}
                  </span>
                </span>
                <span className="pt-1 lg:pt-0">
                  <span className="t-headline block text-[19px] text-fg lg:mt-5">{step.title}</span>
                  <span className="t-small mt-1.5 block max-w-[17rem] lg:mx-auto">{step.text}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
