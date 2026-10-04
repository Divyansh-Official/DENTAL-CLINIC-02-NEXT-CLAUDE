import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

/** Service detail: the description, then what the treatment includes. */
export default function ServiceOverview({ service, labels = {} }) {
  const includes = Array.isArray(service.includes) ? service.includes : [];

  return (
    <div>
      {service.description ? (
        <Reveal>
          <h2 className="t-title">{labels.overview}</h2>
          <p className="mt-5 text-[clamp(18px,1rem+0.4vw,21px)] leading-[1.55] tracking-[-0.014em] text-fg-2">{service.description}</p>
        </Reveal>
      ) : null}

      {includes.length ? (
        <div className="mt-14">
          <Reveal as="h2" className="t-title">
            {labels.includes}
          </Reveal>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {includes.map((item, index) => (
              <Reveal as="li" key={item} index={index % 2} className="tile flex items-start gap-3.5 bg-tile p-5">
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary text-on-primary">
                  <Icon name="check" size={13} strokeWidth={2.4} />
                </span>
                <span className="text-[16px] leading-snug text-fg">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
