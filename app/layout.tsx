import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CV Mitra Chemical Indonesia',
  description: 'Katalog cat tembok, cat kendaraan, dan thinner CV Mitra Chemical Indonesia di Cikande, Banten.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='%23075cdd'/%3E%3Ctext x='6' y='28' fill='white' font-size='24'%3ECI%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
