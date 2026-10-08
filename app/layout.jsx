import CustomCursor from '@/components/layout/CustomCursor';
import SkipLink from '@/components/layout/SkipLink';
import { profile } from '@/content/profile';
import { ogImage } from '@/lib/ogImages';
import { createPreferencesBootstrapScript } from '@/lib/readerPreferences';
import { BASE_PATH, SITE_ORIGIN, absoluteUrl } from '@/lib/site';
import './globals.css';

const SITE_TITLE = `${profile.name} — ${profile.role}`;

export const metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_TITLE,
    template: `%s · ${profile.name}`,
  },
  description: profile.description,
  authors: [{ name: profile.name, url: absoluteUrl('/') }],
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    type: 'website',
    siteName: profile.name,
    title: SITE_TITLE,
    description: profile.description,
    url: absoluteUrl('/'),
    locale: 'en_US',
    images: [ogImage('home', SITE_TITLE)],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport = {
  themeColor: '#000000',
  colorScheme: 'dark light',
};

/**
 * Restricts where scripts, styles, images and fonts can load from. Inline
 * scripts must stay allowed: Next.js streams page data through inline
 * <script> tags. GitHub Pages can't send HTTP headers, so this uses <meta>
 * (which can't express frame-ancestors). Production only: the dev server
 * needs eval and websockets for hot reloading.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

export default function RootLayout({ children }) {
  return (
    // Writeup pages set reader theme attributes on <html> before hydration.
    // data-scroll-behavior lets Next.js turn smooth scrolling off during route changes.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        )}
        {/* Applies saved reader theme/font/size on writeup pages before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: createPreferencesBootstrapScript(BASE_PATH) }} />
      </head>
      <body>
        <SkipLink />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
