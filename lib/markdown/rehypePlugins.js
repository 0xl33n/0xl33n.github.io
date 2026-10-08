/**
 * Small rehype plugins used by the article pipeline (lib/markdown/processMarkdown.js).
 * Each runs after sanitization, so the attributes they add are trusted.
 */
import GithubSlugger from 'github-slugger';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import { isExternalUrl, resolveMarkdownImage } from '../markdownAssets';

const DEFAULT_IMAGE_ALT = 'Article image';

/** Rendered width of article images: the text column (~680px) or the viewport minus padding on phones. */
const IMAGE_SIZES = '(max-width: 728px) calc(100vw - 40px), 680px';

/** Points images at their optimized files and adds dimensions + lazy loading. */
export function rehypeArticleImages({ manifest }) {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      const { src, width, height, srcSet } = resolveMarkdownImage(String(node.properties.src ?? ''), manifest);
      node.properties.src = src;
      if (width && height) Object.assign(node.properties, { width, height });
      if (srcSet) Object.assign(node.properties, { srcSet, sizes: IMAGE_SIZES });
      node.properties.alt = node.properties.alt || DEFAULT_IMAGE_ALT;
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
    });
  };
}

/** Opens external links in a new tab without leaking the opener or referrer. */
export function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a' || !isExternalUrl(node.properties.href)) return;
      node.properties.target = '_blank';
      node.properties.rel = ['noopener', 'noreferrer'];
    });
  };
}

/**
 * Gives h2–h4 headings stable, unique ids (GitHub-style slugs) and records
 * them in `headings` for the table of contents.
 *
 * @param {{ headings: { depth: number, id: string, text: string }[] }} options
 */
export function rehypeHeadingIds({ headings }) {
  return (tree) => {
    const slugger = new GithubSlugger();
    visit(tree, 'element', (node) => {
      const match = /^h([2-4])$/.exec(node.tagName);
      if (!match) return;
      const text = toString(node).trim();
      if (!text) return;
      const id = slugger.slug(text);
      node.properties.id = id;
      headings.push({ depth: Number(match[1]), id, text });
    });
  };
}
