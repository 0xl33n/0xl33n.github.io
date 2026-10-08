import { ImageResponse } from 'next/og';
import OgImage, { OG_IMAGE_SIZE } from '@/components/seo/OgImage';
import { profile } from '@/content/profile';
import { getAllWriteups, getWriteup } from '@/lib/writeups';

/**
 * Social preview images, generated at build time as real .png files:
 *   /og/home.png, /og/writeups.png and /og/<writeup-slug>.png
 *
 * (Next's `opengraph-image` file convention exports files without an
 * extension, which GitHub Pages serves with the wrong content type.)
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

const PAGE_IMAGES = {
  'home.png': {
    eyebrow: 'product security / research',
    title: profile.name,
    subtitle: profile.headline,
    path: '~/dev',
  },
  'writeups.png': {
    eyebrow: 'writeups',
    title: 'Notes from the lab',
    subtitle: `Reverse engineering and security research by ${profile.name}`,
    path: '~/writeups/',
  },
};

export function generateStaticParams() {
  const writeupImages = getAllWriteups().map(({ slug }) => `${slug}.png`);
  return [...Object.keys(PAGE_IMAGES), ...writeupImages].map((image) => ({ image }));
}

export async function GET(_request, { params }) {
  const { image } = await params;

  if (PAGE_IMAGES[image]) {
    return new ImageResponse(<OgImage {...PAGE_IMAGES[image]} />, OG_IMAGE_SIZE);
  }

  const slug = image.replace(/\.png$/, '');
  const writeup = getWriteup(slug);
  return new ImageResponse(
    <OgImage
      eyebrow={`writeup · ${writeup.readingMinutes} min read`}
      title={writeup.title}
      subtitle={`${profile.name} — ${profile.role}`}
      path={`~/writeups/${slug}.md`}
    />,
    OG_IMAGE_SIZE,
  );
}
