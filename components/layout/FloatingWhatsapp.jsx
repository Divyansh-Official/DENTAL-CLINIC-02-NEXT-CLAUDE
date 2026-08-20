'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import { clinicWhatsapp, t } from '@/lib/data';
import { spring } from '@/lib/motion';

/**
 * Persistent WhatsApp affordance for desktop and tablet. On mobile the sticky
 * action bar already carries it, so this sits out of the way above the fold
 * line and never competes with it.
 */
export default function FloatingWhatsapp() {
  const href = clinicWhatsapp();
  const reduceMotion = useReducedMotion();
  if (!href) return null;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...spring.gentle, delay: 1.2 }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="fixed bottom-6 right-5 z-[75] hidden h-13 w-13 place-items-center rounded-full bg-primary text-on-primary shadow-panel transition-colors hover:bg-primary-600 md:grid"
      style={{ height: 52, width: 52 }}
    >
      <Icon name="whatsapp" size={22} label={t('floatingWhatsapp.label')} />
    </motion.a>
  );
}
