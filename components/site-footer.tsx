import { ArrowUpRight, MapPin } from 'lucide-react';
import { contactConfig } from '@/lib/contact-config';

const categories = ['Cat Tembok', 'Cat Kendaraan', 'Thinner'];
const linkStyle = 'inline-block rounded-sm py-1 text-sm text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

export function SiteFooter() {
  return (
    <footer aria-label="Informasi CV Mitra Chemical Indonesia" className="relative mx-4 mt-16 mb-8 block max-w-7xl overflow-hidden rounded-3xl bg-zinc-950 p-0 text-white ring-1 ring-white/10 sm:mx-8 xl:mx-auto">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
      <div className="relative px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row">
          <div className="max-w-sm">
            <a href="#home" className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" aria-label="CV Mitra Chemical Indonesia — Beranda">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold tracking-tight text-zinc-900 shadow-sm">CI</span>
              <span className="text-base font-medium tracking-tight">CV MITRA CHEMICAL INDONESIA</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/70">Cat tembok, cat kendaraan, dan thinner untuk kebutuhan usaha maupun pribadi.</p>
            <a href="#contact-section" className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Hubungi tim kami <ArrowUpRight className="size-4" aria-hidden="true" /></a>
          </div>
          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:w-auto lg:gap-x-10">
            <div>
              <p className="text-sm font-medium text-white/90">Produk</p>
              <ul className="mt-3 list-none space-y-1 p-0">
                {categories.map((category) => <li key={category}><a href={`#products?category=${encodeURIComponent(category)}`} className={linkStyle}>{category}</a></li>)}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">Perusahaan</p>
              <ul className="mt-3 list-none space-y-1 p-0">
                <li><a href="#about" className={linkStyle}>Tentang Kami</a></li>
                <li><a href="#contact-section" className={linkStyle}>Contact Us</a></li>
                <li><a href="#privacy" className={linkStyle}>Privasi</a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-sm font-medium text-white/90">Lokasi</p>
              <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-white/65"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{contactConfig.address}</span></p>
              <a href="#contact-section" className={`${linkStyle} mt-2`}>Lihat peta <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="m-0 text-xs text-white/60">© {new Date().getFullYear()} CV Mitra Chemical Indonesia.</p>
          <a href="#home" className={linkStyle}>Kembali ke beranda <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
