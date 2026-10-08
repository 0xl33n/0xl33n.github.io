import { absoluteUrl } from '@/lib/site';
import { getAllWriteups } from '@/lib/writeups';

export const dynamic = 'force-static';

/** /sitemap.xml: homepage, writeups list and every published writeup. */
export default function sitemap() {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/writeups/'), changeFrequency: 'weekly', priority: 0.9 },
    ...getAllWriteups()
      .filter((writeup) => !writeup.isDraft)
      .map((writeup) => ({
        url: absoluteUrl(`/writeups/${writeup.slug}/`),
        ...(writeup.date && { lastModified: writeup.date }),
        changeFrequency: 'yearly',
        priority: 0.8,
      })),
  ];
}
