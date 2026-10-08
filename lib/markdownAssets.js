import { sitePath } from './site';

const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;
const ARTICLE_IMAGE_PREFIX = /^(?:\.\/)?images\//;

/**
 * Resolves an image URL written in writeup Markdown.
 *
 * Relative paths (`images/foo.png`, `./images/foo.png`) refer to originals in
 * the writeup's own images/ folder (content/writeups/<slug>/images/) and are
 * mapped to their optimized WebP versions via the manifest written by
 * scripts/optimize-images.mjs.
 *
 * @param {string} url - URL as written in the Markdown.
 * @param {Record<string, { src: string, width: number, height: number, srcset?: { src: string, width: number }[] }>} manifest
 *   This writeup's images, keyed by file name.
 * @returns {{ src: string, width?: number, height?: number, srcSet?: string }}
 */
export function resolveMarkdownImage(url, manifest) {
  if (!url || ABSOLUTE_URL.test(url) || !ARTICLE_IMAGE_PREFIX.test(url)) return { src: url };

  const fileName = url.replace(ARTICLE_IMAGE_PREFIX, '');
  const entry = manifest[fileName];
  if (!entry) {
    throw new Error(`image "${url}" not found. Put it in this writeup's images/ folder (next to the .md file).`);
  }
  const srcSet =
    entry.srcset?.length > 1
      ? entry.srcset.map(({ src, width }) => `${sitePath(src)} ${width}w`).join(', ')
      : undefined;
  return { src: sitePath(entry.src), width: entry.width, height: entry.height, ...(srcSet && { srcSet }) };
}

/** True for links that leave the site (http, https, protocol-relative). */
export function isExternalUrl(url) {
  return /^(?:https?:)?\/\//i.test(url ?? '');
}
