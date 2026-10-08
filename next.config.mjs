/**
 * Next.js configuration.
 *
 * The site is exported as static files for GitHub Pages. One environment
 * variable drives deployment:
 *
 *   NEXT_PUBLIC_SITE_URL=https://<user>.github.io/<repo>
 *
 * Its path ("/<repo>") becomes the basePath, and the full URL is used for
 * canonical links, the sitemap and social preview tags. The GitHub Actions
 * workflow sets it automatically; locally it defaults to http://localhost:3000.
 */
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
const basePath = siteUrl.pathname.replace(/\/+$/, '');

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  env: {
    // Exposed to client code (lib/site.js) for building raw URLs.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  // Dev server only: Next.js blocks its dev resources (hot reload, etc.) for
  // hosts other than localhost, which stops pages from hydrating when the dev
  // server is shared through a tunnel. Has no effect on the static build.
  allowedDevOrigins: ['*.trycloudflare.com'],
  experimental: {
    // Inline the (small, ~7 KB gzipped) CSS into each page's HTML instead of a
    // render-blocking <link>. Measured on a throttled phone profile, this
    // roughly halves first paint for new visitors, the main audience here.
    inlineCss: true,
  },
};

export default nextConfig;
