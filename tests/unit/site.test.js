import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadSite(siteUrl) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', siteUrl);
  vi.stubEnv('NEXT_PUBLIC_BASE_PATH', undefined);
  return import('@/lib/site');
}

afterEach(() => vi.unstubAllEnvs());

describe('site URLs', () => {
  it('derives the basePath from a GitHub Pages project URL', async () => {
    const site = await loadSite('https://neel.github.io/portfolio');
    expect(site.BASE_PATH).toBe('/portfolio');
    expect(site.sitePath('/resume.pdf')).toBe('/portfolio/resume.pdf');
    expect(site.sitePath('resume.pdf')).toBe('/portfolio/resume.pdf');
    expect(site.absoluteUrl('/writeups/x/')).toBe('https://neel.github.io/portfolio/writeups/x/');
  });

  it('works at a domain root (user site or custom domain)', async () => {
    const site = await loadSite('https://neel.dev');
    expect(site.BASE_PATH).toBe('');
    expect(site.absoluteUrl()).toBe('https://neel.dev/');
    expect(site.RESUME_URL).toBe('/resume.pdf');
  });
});
