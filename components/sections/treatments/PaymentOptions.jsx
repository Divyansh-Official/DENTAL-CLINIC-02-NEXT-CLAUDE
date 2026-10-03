import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';

/** Treatments: how to pay, and which insurers the clinic works with. */
export default function PaymentOptions({ payments = {}, labels = {} }) {
  const methods = Array.isArray(payments.methods) ? payments.methods : [];
  const insurance = payments.insurance || {};
  const partners = Array.isArray(insurance.partners) ? insurance.partners : [];
  if (!methods.length && !partners.length) return null;

  return (
    <section className="tone-gray section">
      <div className="shell">
        <SectionHeader eyebrow={labels.eyebrow} title={payments.title} accent={labels.accent} intro={labels.intro} />
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {methods.length ? (
            <Reveal className="tile flex flex-col bg-tile p-7 sm:p-9">
              <span className="icon-tile">
                <Icon name={payments.icon || 'wallet'} size={24} />
              </span>
              <h3 className="t-headline mt-6">{labels.methodsTitle}</h3>
              <ul className="mt-5 space-y-3">
                {methods.map((method) => (
                  <li key={method} className="flex items-start gap-3 text-[16px] text-fg">
                    <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary-soft text-primary">
                      <Icon name="check" size={13} strokeWidth={2.4} />
                    </span>
                    {method}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
          {partners.length || insurance.text ? (
            <Reveal index={1} className="tile flex flex-col bg-tile p-7 sm:p-9">
              <span className="icon-tile">
                <Icon name={insurance.icon || 'insurance'} size={24} />
              </span>
              <h3 className="t-headline mt-6">{labels.insuranceTitle}</h3>
              {insurance.text ? <p className="t-body mt-3">{insurance.text}</p> : null}
              {partners.length ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {partners.map((partner) => (
                    <li key={partner} className="chip min-h-9 px-4 text-[14px] text-fg">
                      {partner}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
