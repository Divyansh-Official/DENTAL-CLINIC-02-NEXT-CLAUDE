'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Reveal, { RevealWords } from '@/components/ui/Reveal';
import { t } from '@/lib/data';
import { IOS_EASE, IOS_SOFT } from '@/lib/motion';

/**
 * Inner-page header. Deliberately quieter than the home hero: a breadcrumb,
 * one rule that draws itself, and the title rising word by word. The page
 * itself is the content, not this block.
 *
 * The same `breadcrumb` array is handed to `breadcrumbSchema()` on each page,
 * so the visible trail and the structured data cannot drift apart.
 */
export default function PageHero({ eyebrow, title, italicWord, intro, breadcrumb = [], children }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-surface-50 pt-[calc(var(--nav-h)+4.5rem)]">
      <div className="shell relative z-10 pb-20">
        {breadcrumb.length ? (
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: IOS_SOFT }}
            aria-label={t('common.breadcrumbLabel')}
            className="mb-9 flex flex-wrap items-center gap-2.5 text-[14.5px] text-ink-faint"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              {t('common.home')}
            </Link>
            {breadcrumb.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-2.5">
                <Icon name="chevron-right" size={11} tone="accent" />
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

        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow ? (
              <div className="flex items-center gap-5">
                <p className="eyebrow">{eyebrow}</p>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: IOS_EASE, delay: 0.2 }}
                  className="hidden h-px w-16 origin-left bg-accent/40 sm:block"
                />
              </div>
            ) : null}

            <h1 className="display-xl mt-6">
              <RevealWords text={title} italicWord={italicWord} />
            </h1>
          </div>

          {intro ? (
            <div className="lg:col-span-5 lg:pb-2">
              <Reveal delay={0.15}>
                <p className="body-lead max-w-[30rem]">{intro}</p>
              </Reveal>
            </div>
          ) : null}
        </div>

        {children ? (
          <Reveal delay={0.24} className="mt-11">
            {children}
          </Reveal>
        ) : null}
      </div>

      <span
        className="glow pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] opacity-[0.09]"
        aria-hidden="true"
      />
    </header>
  );
}
