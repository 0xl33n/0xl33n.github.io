import { toHtml } from 'hast-util-to-html';
import { describe, expect, it } from 'vitest';
import { estimateReadingMinutes, processMarkdown } from '@/lib/markdown/processMarkdown';

const imageManifest = {
  'shot.png': { src: '/images/writeups/shot.webp', width: 1200, height: 800 },
};

const render = (markdown) => {
  const result = processMarkdown(markdown, { imageManifest });
  return { ...result, html: toHtml(result.tree) };
};

describe('processMarkdown', () => {
  it('extracts the first h1 as the title and removes it from the body', () => {
    const { title, html } = render('# My Title\n\nIntro paragraph.');
    expect(title).toBe('My Title');
    expect(html).not.toContain('<h1');
    expect(html).toContain('Intro paragraph.');
  });

  it('gives headings unique GitHub-style ids and collects them for the TOC', () => {
    const { headings, html } = render('# T\n\n## Setup\n\n### Details\n\n## Setup');
    expect(headings).toEqual([
      { depth: 2, id: 'setup', text: 'Setup' },
      { depth: 3, id: 'details', text: 'Details' },
      { depth: 2, id: 'setup-1', text: 'Setup' },
    ]);
    expect(html).toContain('<h2 id="setup">');
    expect(html).toContain('<h2 id="setup-1">');
  });

  it('sanitizes raw HTML: scripts, event handlers and javascript: URLs are removed', () => {
    const { html } = render(
      '# T\n\n<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[click](javascript:alert(1))',
    );
    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('javascript:');
  });

  it('resolves local images to optimized files with dimensions and lazy loading', () => {
    const { html } = render('# T\n\n![Diagram](images/shot.png)');
    expect(html).toContain('src="/images/writeups/shot.webp"');
    expect(html).toContain('width="1200"');
    expect(html).toContain('height="800"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('alt="Diagram"');
  });

  it('opens external links in a new tab without leaking the referrer', () => {
    const { html } = render('# T\n\n[site](https://example.com) and [anchor](#x)');
    expect(html).toContain('href="https://example.com" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('<a href="#x">anchor</a>');
  });

  it('highlights fenced code with a language', () => {
    const { html } = render('# T\n\n```js\nconst x = 1;\n```');
    expect(html).toContain('hljs-keyword');
  });
});

describe('estimateReadingMinutes', () => {
  it('counts prose at ~230 words per minute, ignoring code blocks', () => {
    const prose = Array.from({ length: 460 }, () => 'word').join(' ');
    const code = Array.from({ length: 5000 }, () => 'token').join(' ');
    const { tree } = processMarkdown(`# T\n\n${prose}\n\n\`\`\`\n${code}\n\`\`\``, { imageManifest });
    expect(estimateReadingMinutes(tree)).toBe(2);
  });

  it('never reports less than one minute', () => {
    const { readingMinutes } = processMarkdown('# T\n\nShort.', { imageManifest });
    expect(readingMinutes).toBe(1);
  });
});
