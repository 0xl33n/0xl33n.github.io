/**
 * Turns a Markdown file from content/writeups/ into a writeup object.
 * Pure (no file system access) so the rules are easy to test.
 */
import { splitFrontmatter } from './markdown/frontmatter';
import { processMarkdown } from './markdown/processMarkdown';

/** URL-safe file names: lowercase words joined by hyphens. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;
const DESCRIPTION_MAX_LENGTH = 160;

/** Shortens text to `maxLength` at a word boundary, adding an ellipsis. */
export function truncate(text, maxLength = DESCRIPTION_MAX_LENGTH) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const cut = normalized.slice(0, maxLength - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : cut.length).replace(/[,.;:]$/, '')}…`;
}

/**
 * @typedef {Object} Writeup
 * @property {string} slug
 * @property {string} title
 * @property {string} description - Frontmatter description, or a summary of the first paragraph.
 * @property {boolean} hasCustomDescription - True when the description was written in the frontmatter.
 * @property {string | null} date - YYYY-MM or YYYY-MM-DD.
 * @property {string | null} topic - Groups writeups on the /writeups/ page, e.g. "Mobile App Pentesting".
 * @property {string[]} tags
 * @property {boolean} isDraft
 * @property {number} readingMinutes
 * @property {{ depth: number, id: string, text: string }[]} headings
 * @property {import('hast').Root} tree
 */

/**
 * @param {{ slug: string, source: string, imageManifest: Record<string, object>, sourcePath?: string }} input
 *   imageManifest: this writeup's images (from its images/ folder); sourcePath: for error messages.
 * @returns {Writeup}
 * @throws {Error} with a message pointing at the problem, which fails the build
 */
export function createWriteup({ slug, source, imageManifest, sourcePath = `content/writeups/${slug}/index.md` }) {
  const fail = (message) => {
    throw new Error(`${sourcePath}: ${message}`);
  };

  if (!SLUG_PATTERN.test(slug)) {
    fail('folder and file names must be lowercase words separated by hyphens, e.g. "my-writeup".');
  }

  let data;
  let body;
  try {
    ({ data, body } = splitFrontmatter(source));
  } catch (error) {
    fail(`invalid frontmatter: ${error.message}`);
  }

  const date = data.date == null ? null : String(data.date);
  if (date && !DATE_PATTERN.test(date)) fail(`"date" must look like 2024-07 or 2024-07-15 (got "${date}").`);

  const topic = data.topic == null ? '' : String(data.topic).replace(/\s+/g, ' ').trim();

  const tags = data.tags == null ? [] : [].concat(data.tags).map(String);

  let processed;
  try {
    processed = processMarkdown(body, { imageManifest });
  } catch (error) {
    fail(error.message);
  }

  const title = (data.title && String(data.title)) || processed.title;
  if (!title) fail('add a "# Title" heading or a "title:" in the frontmatter.');

  return {
    slug,
    title,
    description: data.description ? String(data.description).trim() : truncate(processed.firstParagraph),
    hasCustomDescription: Boolean(data.description),
    date,
    topic: topic || null,
    tags,
    isDraft: data.draft === true,
    readingMinutes: processed.readingMinutes,
    headings: processed.headings,
    tree: processed.tree,
  };
}

/** Newest first; undated writeups after dated ones, then by title. */
export function compareWriteups(a, b) {
  if (a.date !== b.date) {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  }
  return a.title.localeCompare(b.title);
}
