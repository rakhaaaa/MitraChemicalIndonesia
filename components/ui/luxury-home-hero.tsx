'use client';

import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
import { AnimatedHero } from '@/components/ui/animated-hero-section-1';

const navLinks = [
  { label: 'Beranda', href: '#home' },
  { label: 'Produk', href: '#products' },
  { label: 'Tentang Kami', href: '#about' },
  { label: 'Contact Us', href: '#contact-section' },
];

export function LuxuryHomeHero() {
  return (
    <AnimatedHero
      backgroundImageUrl="/luxury-home-interior.webp"
      logo={(
        <>
          <span aria-hidden="true" className="inline-flex size-9 items-center justify-center rounded-full bg-white text-xs font-bold tracking-tight text-zinc-900">CI</span>
          <span className="text-sm font-semibold tracking-wide text-white sm:text-base">CV Mitra Chemical Indonesia</span>
        </>
      )}
      navLinks={navLinks}
      topRightAction={<a href="#contact-section" className="inline-flex min-h-11 items-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-medium text-white hover:bg-white/20">Contact Us</a>}
      showNavigation={false}
      title="Warna untuk ruang. Perlindungan untuk permukaan."
      description="Temukan pilihan cat tembok, cat kendaraan, dan thinner untuk kebutuhan pribadi maupun bisnis Anda."
      ctaButton={{ text: 'Jelajahi Produk', onClick: () => { window.location.hash = '#products'; } }}
      secondaryCta={{ text: 'Contact Us', onClick: () => { window.location.hash = '#contact-section'; } }}
      footerContent={(
        <div className="flex flex-col gap-3 border-t border-white/35 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#app"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById('app')?.scrollIntoView({
                behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                block: 'start',
              });
            }}
            className="inline-flex min-h-10 w-fit items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <ArrowDown className="size-4" aria-hidden="true" />
            Scroll untuk melihat produk
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <p className="m-0 flex items-center gap-2 text-xs text-white/80 sm:text-sm">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            Berbasis di Cikande, Banten <span aria-hidden="true">·</span> Melayani seluruh Indonesia
          </p>
        </div>
      )}
    />
  );
}
