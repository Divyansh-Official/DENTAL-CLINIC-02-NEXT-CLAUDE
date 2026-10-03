/**
 * Soft fields of brand colour behind a section. They give the glass
 * something to refract and keep white space from reading as flat paper.
 * Static under reduced motion; otherwise they drift very slowly (CSS only).
 */
const VARIANTS = {
  hero: [
    { tint: '--c-primary', size: '58rem', alpha: 0.32, top: '-34rem', left: '-18rem', dx: '6%', dy: '8%', dur: '26s' },
    { tint: '--c-accent', size: '50rem', alpha: 0.3, top: '-10rem', right: '-22rem', dx: '-7%', dy: '6%', dur: '30s' },
    { tint: '--c-grad-mid', size: '46rem', alpha: 0.18, top: '22rem', left: '30%', dx: '-5%', dy: '-6%', dur: '34s' }
  ],
  soft: [
    { tint: '--c-primary', size: '46rem', alpha: 0.16, top: '-28rem', right: '-12rem', dx: '-5%', dy: '7%', dur: '28s' },
    { tint: '--c-accent', size: '40rem', alpha: 0.15, top: '-18rem', left: '-16rem', dx: '6%', dy: '5%', dur: '32s' }
  ],
  night: [
    { tint: '--c-primary', size: '44rem', alpha: 0.6, top: '-22rem', left: '-14rem', dx: '8%', dy: '6%', dur: '24s' },
    { tint: '--c-accent', size: '40rem', alpha: 0.5, bottom: '-24rem', right: '-12rem', dx: '-6%', dy: '-8%', dur: '28s' }
  ]
};

export default function Aurora({ variant = 'soft', className = '' }) {
  const blobs = VARIANTS[variant] || VARIANTS.soft;
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      {blobs.map((blob, index) => (
        <span
          key={index}
          style={{
            '--tint': `var(${blob.tint})`,
            '--size': blob.size,
            '--alpha': blob.alpha,
            '--dx': blob.dx,
            '--dy': blob.dy,
            '--dur': blob.dur,
            top: blob.top,
            left: blob.left,
            right: blob.right,
            bottom: blob.bottom
          }}
        />
      ))}
    </div>
  );
}
