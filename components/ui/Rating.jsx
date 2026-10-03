import Icon from './Icon';

/**
 * Five-star row. The score is announced once ("4.9 out of 5 stars"); the
 * individual stars are decorative. Partial stars are drawn by clipping.
 */
export default function Rating({ value = 5, max = 5, size = 14, label, className = '' }) {
  const score = Math.max(0, Math.min(max, Number(value) || 0));

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={label}>
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, score - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Icon name="star" size={size} className="absolute inset-0 text-fg/15" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Icon name="star" size={size} className="text-[#FF9F0A]" />
            </span>
          </span>
        );
      })}
    </span>
  );
}
