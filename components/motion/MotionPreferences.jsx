/**
 * Applies the screenshot switch before first paint.
 *
 * `?nomotion` in the URL (or localStorage.nomotion = '1' for a whole session)
 * adds `no-motion` to <html>, and every entrance, reveal and transition in
 * globals.css is skipped — so the site can be screenshotted for a portfolio
 * or a client review without catching anything mid-flight. Visitors who ask
 * their system for reduced motion get the same result from the media query.
 *
 * It runs inline in <head> rather than in an effect so the class is present
 * before anything paints. <html> carries suppressHydrationWarning for it.
 */
const SCRIPT = `(function(){try{var d=document.documentElement,q=location.search;if(/[?&]nomotion(=|&|$)/.test(q)||localStorage.getItem('nomotion')==='1'){d.classList.add('no-motion')}}catch(e){}})();`;

export default function MotionPreferences() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
