import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SITE_URL, site } from '@/data/site';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const title = site.title;

export const metadata: Metadata = {
  title,
  description: site.description,
  authors: [{ name: site.name, url: SITE_URL }],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/`,
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: `${SITE_URL}/assets/stm32-msi/mixed_capture.png`, width: 2450, height: 1575, alt: 'Mixed-signal capture from the STM32 instrument' }],
  },
  twitter: { card: 'summary_large_image', title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: '#101416',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
