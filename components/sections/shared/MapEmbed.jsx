/**
 * Google Maps embed in a rounded frame. Lazy-loaded, so the iframe and its
 * scripts cost nothing until the visitor scrolls near it.
 */
export default function MapEmbed({ src, title, className = 'h-[320px] sm:h-[420px]' }) {
  if (!src) return null;
  return (
    <div className="media relative overflow-hidden rounded-panel">
      <iframe
        title={title}
        src={src}
        className={`block w-full border-0 ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
