import { toString } from 'hast-util-to-string';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { rehypeArticleImages, rehypeExternalLinks, rehypeHeadingIds } from './rehypePlugins';

const WORDS_PER_MINUTE = 230;

/**
 * Turns article Markdown into a sanitized HTML syntax tree (hast) plus the
 * metadata the article page needs.
 *
 * Pipeline order matters: raw HTML is parsed, then sanitized (stripping
 * scripts, event handlers, etc.), and only then do our own plugins add ids,
 * image attributes and syntax-highlighting classes.
 *
 * @param {string} markdown
 * @param {{ imageManifest: Record<string, { src: string, width: number, height: number }> }} options
 * @returns {{ title: string, firstParagraph: string, tree: import('hast').Root, headings: { depth: number, id: string, text: string }[], readingMinutes: number }}
 */
export function processMarkdown(markdown, { imageManifest }) {
  const headings = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeArticleImages, { manifest: imageManifest })
    .use(rehypeExternalLinks)
    .use(rehypeHeadingIds, { headings })
    .use(rehypeHighlight, { detect: false });

  const tree = processor.runSync(processor.parse(markdown));

  // The first h1 is the article title; the page renders it in its own header.
  const titleIndex = tree.children.findIndex((node) => node.type === 'element' && node.tagName === 'h1');
  const title = titleIndex === -1 ? '' : toString(tree.children[titleIndex]).trim();
  if (titleIndex !== -1) tree.children.splice(titleIndex, 1);

  const firstParagraph = tree.children.find((node) => node.type === 'element' && node.tagName === 'p');

  return {
    title,
    firstParagraph: firstParagraph ? toString(firstParagraph).trim() : '',
    tree,
    headings,
    readingMinutes: estimateReadingMinutes(tree),
  };
}

/** Reading time from prose only; code blocks are skimmed, not read word by word. */
export function estimateReadingMinutes(tree) {
  const prose = tree.children
    .filter((node) => !(node.type === 'element' && node.tagName === 'pre'))
    .map((node) => toString(node))
    .join(' ');
  const wordCount = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
