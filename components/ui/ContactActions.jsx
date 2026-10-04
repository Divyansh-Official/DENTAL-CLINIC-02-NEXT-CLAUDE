import Button from './Button';
import CopyButton from './CopyButton';
import Icon from './Icon';

/**
 * A dentist's direct line — call, plus copy / WhatsApp / email — laid out
 * for the space it is given rather than the screen (a container query in
 * globals.css, `.contact-actions`):
 *
 *   narrow   the call button full width, the other three as equal-width
 *            labelled buttons on one row beneath it, edges aligned
 *   tight    the same row, icons only (a card in a two-column grid)
 *   wide     everything on one line, the three as round buttons
 *
 *   tone   'dark' over a photograph, 'light' on a tile
 *   size   'lg' matches a large button (hero), 'md' a medium one (cards)
 */
const TONES = { dark: 'action-dark', light: 'action-light' };

export default function ContactActions({ phone, phoneHref, whatsappHref, emailHref, labels = {}, tone = 'light', size = 'lg', className = '' }) {
  if (!phoneHref && !whatsappHref && !emailHref) return null;
  const toneClass = TONES[tone] || TONES.light;
  const iconSize = size === 'lg' ? 20 : 18;

  return (
    <div className={`contact-actions-wrap ${className}`}>
      <div className="contact-actions" data-size={size}>
        {phoneHref ? (
          <Button href={phoneHref} size={size === 'lg' ? 'lg' : 'md'} iconStart="phone" className="contact-actions-primary">
            {phone}
          </Button>
        ) : null}
        <div className="contact-actions-secondary">
          {phone ? (
            <CopyButton
              variant="action"
              value={phone}
              label={labels.copy}
              copiedLabel={labels.copied}
              visibleLabel={labels.copyShort}
              iconSize={iconSize}
              className={`action-btn ${toneClass}`}
            />
          ) : null}
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`action-btn ${toneClass}`} aria-label={labels.whatsapp}>
              <Icon name="whatsapp" size={iconSize} className="text-[#30D158]" />
              <span className="action-label">{labels.whatsappShort}</span>
            </a>
          ) : null}
          {emailHref ? (
            <a href={emailHref} className={`action-btn ${toneClass}`} aria-label={labels.email}>
              <Icon name="mail" size={iconSize} />
              <span className="action-label">{labels.emailShort}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
