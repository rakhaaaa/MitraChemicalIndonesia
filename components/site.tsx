'use client';

import { useEffect, useRef, useState } from 'react';
import { ContactWithMap, type ContactFormData } from '@/components/ui/contact-with-map';
import { contactConfig } from '@/lib/contact-config';
import { SiteFooter } from '@/components/site-footer';
import { AnimatedNavFramer } from '@/components/ui/navigation-menu';
import { LuxuryHomeHero } from '@/components/ui/luxury-home-hero';

declare global {
  interface Window {
    render?: () => void;
    ChemmicalPrototype?: {
      product: (id: string) => { id: string; name: string } | undefined;
    };
  }
}

let legacyReady: Promise<void> | undefined;
function loadLegacy() {
  if (!legacyReady) {
    legacyReady = (async () => {
      for (const src of ['/legacy/navilex-data.js', '/legacy/app.js', '/legacy/reference-overrides.js']) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('The catalogue could not be loaded.'));
          document.body.appendChild(script);
        });
      }
    })();
  }
  return legacyReady;
}

export function Site() {
  const [showContact, setShowContact] = useState(true);
  const [product, setProduct] = useState<ContactFormData['product']>();
  const [loadError, setLoadError] = useState(false);
  const pendingProduct = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    let scrollFrame = 0;
    const scrollToContact = () => {
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = requestAnimationFrame(() => {
          const section = document.getElementById('contact-section');
          section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
          section?.focus({ preventScroll: true });
        });
      });
    };
    const applyProduct = (id: string | null) => {
      pendingProduct.current = id;
      setProduct(id ? window.ChemmicalPrototype?.product(id) : undefined);
    };
    const navigateContact = (id: string | null) => {
      applyProduct(id);
      setShowContact(true);
      const current = (location.hash.slice(1) || 'home').split('?')[0];
      if (current !== 'home') {
        history.replaceState(null, '', `${location.pathname}${location.search}#home`);
        window.render?.();
      }
      scrollToContact();
    };
    const syncRoute = () => {
      const [route, query = ''] = (location.hash.slice(1) || 'home').split('?');
      if (route === 'contact' || route === 'contact-section') {
        navigateContact(new URLSearchParams(query).get('product'));
      } else setShowContact(route === 'home');
    };
    const clickContact = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!target) return;
      const href = target.getAttribute('href') || '';
      if (href !== '#contact' && href !== '#contact-section' && !href.startsWith('#contact?')) return;
      event.preventDefault();
      navigateContact(new URLSearchParams(href.split('?')[1] || '').get('product'));
    };
    document.addEventListener('click', clickContact, true);
    window.addEventListener('hashchange', syncRoute);
    syncRoute();
    void loadLegacy().then(() => {
      if (!active) return;
      if (pendingProduct.current) applyProduct(pendingProduct.current);
      window.render?.();
      syncRoute();
    }).catch(() => { if (active) setLoadError(true); });
    return () => {
      active = false;
      cancelAnimationFrame(scrollFrame);
      document.removeEventListener('click', clickContact, true);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  return <>
    <div className="demo">CV MITRA CHEMICAL INDONESIA <span>Katalog produk dan pertanyaan pelanggan</span><a href="/admin">Admin ↗</a></div>
    <AnimatedNavFramer />
    <main>
      <LuxuryHomeHero />
      {loadError && <p role="alert" className="mx-auto max-w-5xl p-8 text-red-700">Katalog belum berhasil dimuat. Muat ulang halaman untuk mencoba lagi.</p>}
      <div id="app" />
      <div hidden={!showContact}>
        <ContactWithMap {...contactConfig} product={product} onSubmit={async (data) => {
          const response = await fetch('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error('Pesan belum tersimpan.');
        }} />
      </div>
    </main>
    <SiteFooter />
    <dialog id="dialog" />
  </>;
}
