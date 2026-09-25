'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
}

interface AnimatedHeroProps {
  backgroundImageUrl: string;
  logo: React.ReactNode;
  navLinks: NavLink[];
  topRightAction?: React.ReactNode;
  title: string;
  description: string;
  ctaButton: {
    text: string;
    onClick: () => void;
  };
  secondaryCta?: {
    text: string;
    onClick: () => void;
  };
  /** Keep the site's existing global navigation when this hero is used on the homepage. */
  showNavigation?: boolean;
  /** Optional in-flow information row at the bottom of the hero. */
  footerContent?: React.ReactNode;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function AnimatedHero({
  backgroundImageUrl,
  logo,
  navLinks,
  topRightAction,
  title,
  description,
  ctaButton,
  secondaryCta,
  showNavigation = true,
  footerContent,
  className,
}: AnimatedHeroProps) {
  const reducedMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const glassButtonClassName =
    'rounded-full border border-white/25 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:ring-white';

  return (
    <section
      id="home"
      aria-label="Beranda CV Mitra Chemical Indonesia"
      className={cn('relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-zinc-950 text-white', className)}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      {showNavigation && (
        <motion.header
          initial={reducedMotion ? false : { y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease: 'easeOut' }}
          className="absolute inset-x-0 top-0 z-20 flex min-h-20 items-center justify-between px-5 py-4 text-white sm:px-8 lg:px-12"
        >
          <div className="flex min-w-0 items-center gap-2">{logo}</div>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-sm text-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:block">{topRightAction}</div>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            aria-controls="animated-hero-mobile-nav"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
          >
            {mobileMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                id="animated-hero-mobile-nav"
                aria-label="Navigasi utama"
                initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reducedMotion ? 0 : 0.18 }}
                className="absolute inset-x-4 top-[calc(100%-0.25rem)] flex flex-col gap-1 rounded-2xl border border-white/15 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-lg md:hidden"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                  >
                    {link.label}
                  </a>
                ))}
                {topRightAction && <div className="border-t border-white/10 pt-2">{topRightAction}</div>}
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>
      )}

      <motion.main
        variants={containerVariants}
        initial={reducedMotion ? false : 'hidden'}
        animate="visible"
        className={cn(
          'relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center px-5 pb-12 pt-32 text-left sm:px-8 sm:pb-16 sm:pt-36 lg:px-12',
          !showNavigation && 'pt-28 sm:pt-32',
        )}
      >
        <motion.p variants={itemVariants} className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-sm">
          CV Mitra Chemical Indonesia
        </motion.p>
        <motion.h1
          variants={itemVariants}
          className="m-0 max-w-4xl text-[clamp(2.65rem,7vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white"
        >
          {title}
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:mt-6 sm:text-lg sm:leading-8">
          {description}
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex w-full flex-wrap items-center gap-3 sm:mt-10 sm:w-auto sm:gap-4">
          <Button onClick={ctaButton.onClick} size="lg" className={cn(glassButtonClassName, 'min-h-12 w-full px-6 sm:w-auto')}>
            {ctaButton.text}
          </Button>
          {secondaryCta && (
            <Button onClick={secondaryCta.onClick} size="lg" variant="outline" className={cn(glassButtonClassName, 'min-h-12 w-full px-6 sm:w-auto')}>
              {secondaryCta.text}
            </Button>
          )}
        </motion.div>
      </motion.main>

      {footerContent && <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-5 sm:px-8 sm:pb-7 lg:px-12">{footerContent}</div>}
    </section>
  );
}
