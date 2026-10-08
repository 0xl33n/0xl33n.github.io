import { absoluteUrl } from './site';

const SIZE = { width: 1200, height: 630 };

/** Open Graph `images` entry for the homepage or an article (see app/og/[image]/route.jsx). */
export function ogImage(name, alt) {
  return { url: absoluteUrl(`/og/${name}.png`), ...SIZE, alt, type: 'image/png' };
}
