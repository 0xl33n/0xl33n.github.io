import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/** /robots.txt: allow everything and point crawlers at the sitemap. */
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
