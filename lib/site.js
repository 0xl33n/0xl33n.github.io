/**
 * Site-wide URL helpers.
 *
 * Next.js prefixes the basePath for <Link> and its own assets, but plain
 * strings such as `/resume.pdf` are regular browser URLs and need it added
 * manually; `sitePath()` does that. `absoluteUrl()` builds full URLs for
 * canonical links, the sitemap and Open Graph tags.
 */
const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

/** Origin only, e.g. `https://neel.github.io`. Used as Next's `metadataBase`. */
export const SITE_ORIGIN = SITE_URL.origin;

/** Sub-path the site is served from, e.g. `/portfolio`, or `''` at the domain root. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? SITE_URL.pathname.replace(/\/+$/, '');

/** Prefixes a root-relative path with the basePath: `/resume.pdf` -> `/portfolio/resume.pdf`. */
export function sitePath(pathname) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${BASE_PATH}${normalized}`;
}

/** Full URL for a root-relative path: `/writeups/x/` -> `https://host/portfolio/writeups/x/`. */
export function absoluteUrl(pathname = '/') {
  return `${SITE_ORIGIN}${sitePath(pathname)}`;
}

export const RESUME_URL = sitePath('/resume.pdf');

/** True when building for a local address (dev server, local test builds) rather than the live site. */
export const IS_LOCAL_SITE = ['localhost', '127.0.0.1', '[::1]'].includes(SITE_URL.hostname);
