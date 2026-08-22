'use client';

import { motion } from 'framer-motion';
import { IOS_SOFT } from '@/lib/motion';
import { useCalmMotion } from '@/lib/hooks';

/**
 * An entrance animation that can be switched off cleanly.
 *
 * When motion is held back this renders a plain element — not a motion
 * component configured to do nothing. That distinction matters: Framer applies
 * its `initial` state as an inline style immediately, and neither removing the
 * props nor passing `initial={false}` clears a style it has already written.
 * A component that starts at `opacity: 0` and never gets an animation frame
 * stays invisible forever, which is exactly the failure mode this avoids.
 *
 * `on` chooses the trigger: 'load' animates on mount, 'view' when scrolled to.
 */
export default function Appear({
  children,
  as = 'div',
  on = 'load',
  delay = 0,
  y = 18,
  duration = 0.8,
  className = '',
  ...rest
}) {
  const calm = useCalmMotion();
  const Tag = as;

  if (calm) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as] || motion.div;
  const trigger =
    on === 'view'
      ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2, margin: '0px 0px -80px 0px' } }
      : { animate: { opacity: 1, y: 0 } };

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      {...trigger}
      transition={{ duration, ease: IOS_SOFT, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
