import Aurora from '@/components/ui/Aurora';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import StatNumber from '@/components/ui/StatNumber';

/**
 * The numbers, on night: large gradient figures in glass tiles over slow
 * fields of brand colour. Any count of statistics lays out — two to a row on
 * a phone, up to four on a desktop.
 */
export default function StatsBand({ stats = [], locale, eyebrow, title, accent }) {
  if (!stats.length) return null;
  const cols = stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';

  return (
    <section className="tone-dark section relative overflow-clip">
      <Aurora variant="night" />
      <div className="shell relative">
        {title ? <SectionHeader eyebrow={eyebrow} title={title} accent={accent} /> : null}
        <ul className={`grid grid-cols-2 gap-3 sm:gap-4 ${cols} ${title ? 'mt-14' : ''}`}>
          {stats.map((stat, index) => (
            <Reveal as="li" key={stat.label} index={index}>
              <div className="glass-dark stat-tile flex h-full flex-col rounded-card p-5 sm:p-7">
                {stat.icon ? (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-primary-glow">
                    <Icon name={stat.icon} size={20} />
                  </span>
                ) : null}
                <StatNumber value={stat.value} suffix={stat.suffix} locale={locale} className="t-stat text-gradient mt-6 block whitespace-nowrap" />
                <span className="mt-2 text-[15px] leading-snug text-on-night-2">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
