import PageTransition from '@/components/layout/PageTransition';
import { isEnabled } from '@/lib/data';

/* Next.js remounts a template on every navigation, which is what lets the
   page rise in softly after a client-side route change. */
export default function Template({ children }) {
  return <PageTransition enabled={isEnabled('pageTransitions')}>{children}</PageTransition>;
}
