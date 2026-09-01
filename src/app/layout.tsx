import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { structuredData } from '@/lib/structured-data';

const SITE = 'https://urbont.com';
const TITLE = 'Urbont — Safe, Affordable Ridesharing in Miami & Florida';
const DESCRIPTION =
  "Urbont is Miami's trusted ridesharing platform. Fast, safe rides at fair prices. " +
  'Earn more as a driver with only 15% commission. Now serving Miami with expansion across Florida and Texas.';

// Portado del <head> de index.html. Es una web de captación: el SEO es
// funcionalidad, no adorno — cualquier cambio aquí afecta al posicionamiento.
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'ridesharing Miami', 'ride hailing Florida', 'uber alternative Miami',
    'driver jobs Miami', 'valet service Miami', 'taxi app Miami',
    'car service Miami', 'transportation app',
  ],
  authors: [{ name: 'Urbont' }],
  alternates: { canonical: SITE + '/' },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    url: SITE + '/',
    siteName: 'Urbont',
    title: 'Urbont — Safe, Affordable Ridesharing in Miami',
    description:
      'Fast, safe rides at fair prices. Join thousands of riders in Miami. ' +
      'Drivers keep 85% — the most competitive commission on the market.',
    images: [{
      url: '/opengraph.jpg',
      width: 1200,
      height: 630,
      alt: 'Urbont — Ridesharing app for Miami and Florida',
    }],
    locale: 'en_US',
    alternateLocale: ['es_US', 'zh_CN', 'fr_FR', 'pt_BR'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@urbontapp',
    creator: '@urbontapp',
    title: 'Urbont — Safe, Affordable Ridesharing in Miami',
    description:
      'Fast, safe rides at fair prices. Drivers keep 85% — the most competitive commission. Download the app today.',
    images: [{ url: '/opengraph.jpg', alt: 'Urbont ridesharing app' }],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/urbont-logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/urbont-logo.png',
  },
  other: {
    'geo.region': 'US-FL',
    'geo.placename': 'Miami, Florida',
    'geo.position': '25.7617;-80.1918',
    ICBM: '25.7617, -80.1918',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1A5A7F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
