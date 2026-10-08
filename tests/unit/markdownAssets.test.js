import { describe, expect, it } from 'vitest';
import { isExternalUrl, resolveMarkdownImage } from '@/lib/markdownAssets';

const manifest = {
  'image1.png': { src: '/images/writeups/image1.webp', width: 800, height: 600 },
};

describe('resolveMarkdownImage', () => {
  it.each(['images/image1.png', './images/image1.png'])('maps %s to the optimized file with dimensions', (url) => {
    expect(resolveMarkdownImage(url, manifest)).toEqual({
      src: '/images/writeups/image1.webp',
      width: 800,
      height: 600,
    });
  });

  it.each(['https://example.com/a.png', '//cdn.example.com/a.png', 'data:image/png;base64,AAAA', '/static/a.png'])(
    'leaves %s unchanged',
    (url) => {
      expect(resolveMarkdownImage(url, manifest)).toEqual({ src: url });
    },
  );

  it('builds a srcset when several sizes exist', () => {
    const withSizes = {
      'big.png': {
        src: '/images/writeups/big.webp',
        width: 1600,
        height: 900,
        srcset: [
          { src: '/images/writeups/big-800w.webp', width: 800 },
          { src: '/images/writeups/big.webp', width: 1600 },
        ],
      },
    };
    expect(resolveMarkdownImage('images/big.png', withSizes).srcSet).toBe(
      '/images/writeups/big-800w.webp 800w, /images/writeups/big.webp 1600w',
    );
  });

  it('fails the build for a missing local image instead of shipping a broken one', () => {
    expect(() => resolveMarkdownImage('images/missing.png', manifest)).toThrow(/not found/);
  });
});

describe('isExternalUrl', () => {
  it('detects off-site links', () => {
    expect(isExternalUrl('https://example.com')).toBe(true);
    expect(isExternalUrl('http://example.com')).toBe(true);
    expect(isExternalUrl('//example.com')).toBe(true);
  });

  it('treats relative, anchor and mailto links as internal', () => {
    expect(isExternalUrl('/writeups/x/')).toBe(false);
    expect(isExternalUrl('#section')).toBe(false);
    expect(isExternalUrl('mailto:a@b.c')).toBe(false);
    expect(isExternalUrl(undefined)).toBe(false);
  });
});
