import Icon from './Icon';

/**
 * Five-star row. The score is announced once as text; the individual stars
 * are decorative, so a screen reader hears "4 out of 5 stars" rather than
 * the word "star" five times.
 */
export default function Rating({ value = 5, max = 5, size = 13, className = '' }) {
  const score = Math.max(0, Math.min(max, Number(value) || 0));

  return (
    <div className={`flex items-center gap-1 ${className}`} role="img" aria-label={`${score} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Icon key={i} name="star" size={size} tone="accent" className={i < score ? 'opacity-100' : 'opacity-25'} />
      ))}
    </div>
  );
}
