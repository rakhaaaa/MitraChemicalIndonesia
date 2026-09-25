'use client';

import * as React from 'react';
import { motion, useScroll, useMotionValueEvent, useReducedMotion, type Variants } from 'framer-motion';
import { Navigation, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Beranda', href: '#home' },
  { name: 'Produk', href: '#products' },
  { name: 'Tentang Kami', href: '#about' },
  { name: 'Contact Us', href: '#contact-section' },
];
const containerVariants: Variants = {
  expanded: { width: 'min(30rem, calc(100vw - 24px))', transition: { type: 'spring', damping: 24, stiffness: 260 } },
  collapsed: { width: '3rem', transition: { type: 'spring', damping: 24, stiffness: 260 } },
};
const itemVariants: Variants = {
  expanded: { opacity: 1, x: 0, scale: 1 },
  collapsed: { opacity: 0, x: -20, scale: 0.95 },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const peakScrollY = React.useRef(0);
  const navRef = React.useRef<HTMLElement>(null);
  const opener = React.useRef<HTMLButtonElement>(null);
  const firstLink = React.useRef<HTMLAnchorElement>(null);
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    if (latest < 40) setExpanded(true);
    else if (isExpanded && latest > previous && latest > 150 && !navRef.current?.contains(document.activeElement)) {
      peakScrollY.current = latest;
      setExpanded(false);
    } else if (!isExpanded) {
      peakScrollY.current = Math.max(peakScrollY.current, latest);
      if (latest < previous && peakScrollY.current - latest > 80) setExpanded(true);
    }
    lastScrollY.current = latest;
  });
  return <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 sm:top-6">
    <motion.nav ref={navRef} aria-label="Navigasi utama" initial={false} animate={isExpanded ? 'expanded' : 'collapsed'} variants={reducedMotion ? undefined : containerVariants}
      style={reducedMotion ? { width: isExpanded ? 'min(30rem, calc(100vw - 24px))' : '3rem' } : undefined}
      className={cn('relative flex h-12 items-center gap-0 overflow-hidden rounded-full border border-zinc-200 bg-white/95 p-0 text-zinc-900 shadow-lg backdrop-blur-md')}
      onKeyDown={(event) => { if (event.key === 'Escape' && isExpanded) { setExpanded(false); requestAnimationFrame(() => opener.current?.focus()); } }}>
      <div id="animated-navigation-links" inert={!isExpanded} aria-hidden={!isExpanded} className="flex h-full w-[min(30rem,calc(100vw-24px))] shrink-0 items-center gap-1 px-2 sm:gap-3 sm:px-4">
        <motion.a ref={firstLink} href="#home" variants={itemVariants} transition={{ duration: reducedMotion ? 0 : 0.2 }} aria-label="CV Mitra Chemical Indonesia — Beranda" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-brand focus-visible:outline-2 focus-visible:outline-brand"><Navigation className="size-5" aria-hidden="true" /></motion.a>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-0 sm:gap-2">
          {navItems.map((item) => <motion.a key={item.href} href={item.href} variants={itemVariants} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-1 text-[12px] font-medium text-zinc-600 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand min-[380px]:text-sm sm:px-2">{item.name}</motion.a>)}
        </div>
      </div>
      {!isExpanded && <button ref={opener} type="button" aria-label="Buka navigasi" aria-expanded={false} aria-controls="animated-navigation-links" onClick={() => { setExpanded(true); requestAnimationFrame(() => firstLink.current?.focus()); }} className="absolute inset-0 flex size-12 min-h-0 items-center justify-center rounded-full bg-transparent p-0 text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand"><Menu className="size-6" aria-hidden="true" /></button>}
    </motion.nav>
  </div>;
}
