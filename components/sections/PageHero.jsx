'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Reveal, { RevealWords } from '@/components/ui/Reveal';
import { t } from '@/lib/data';
import { IOS_EASE, IOS_SOFT } from '@/lib/motion';

/**
 * Inner-page header. Deliberately quieter than the home hero: one rule that
 * draws itself, the title rising word by word, and a breadcrumb. The page
 * itself is the content, not this block.
 *
 * The same `breadcrumb` array is handed to `breadcrumbSchema()` on each page,
 * so the visible trail and the structured data cannot drift apart.
 */
export default function PageHero({ eyebrow, title, italicWord, intro, breadcrumb = [], children }) {
  return (
    <header className="relative overflow-hidden bg-surface-50 pt-[calc(var(--nav-h)+56px)]">
      <div className="shell relative z-10 pb-14">
        {breadcrumb.length ? (
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: IOS_SOFT }}
            aria-label={t('common.breadcrumbLabel')}
            className="mb-7 flex flex-wrap items-center gap-2 text-[12px] text-ink-faint"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              {t('common.home')}
            </Link>
            {breadcrumb.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-2">
                <Icon name="arrow-right" size={10} tone="accent" />
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </motion.nav>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow ? (
              <div className="flex items-center gap-4">
                <p className="eyebrow">{eyebrow}</p>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: IOS_EASE, delay: 0.2 }}
                  className="hidden h-px w-14 origin-left bg-accent/50 sm:block"
                />
              </div>
            ) : null}

            <h1 className="display-xl mt-5 text-[clamp(2.3rem,5vw,3.8rem)]">
              <RevealWords text={title} italicWord={italicWord} />
            </h1>
          </div>

          {intro ? (
            <div className="lg:col-span-5 lg:pb-3">
              <Reveal delay={0.15}>
                <p className="body-lead max-w-md">{intro}</p>
              </Reveal>
            </div>
          ) : null}
        </div>

        {children ? (
          <Reveal delay={0.24} className="mt-9">
            {children}
          </Reveal>
        ) : null}
      </div>

      <span className="glow pointer-events-none absolute -right-32 -top-24 h-[440px] w-[440px] rounded-full opacity-[0.1]" aria-hidden="true" />
      <div className="rule" />
    </header>
  );
}
