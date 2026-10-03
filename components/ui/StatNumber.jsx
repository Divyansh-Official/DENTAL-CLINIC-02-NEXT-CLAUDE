import { formatNumber } from '@/lib/format';

/**
 * A statistic, formatted in the site locale (10,000 · 10,000 · 10.000).
 * Rendered final on the server — the real figure is what crawlers, screen
 * readers and a visitor without JavaScript all see first.
 */
export default function StatNumber({ value, suffix = '', locale = 'en-US', className = '' }) {
  return (
    <span className={className}>
      {formatNumber(value, locale)}
      {suffix}
    </span>
  );
}
