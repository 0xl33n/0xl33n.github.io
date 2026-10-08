/**
 * Writeup discovery (server only: reads the file system at build time).
 *
 * Each writeup is a folder in content/writeups/:
 *
 *   content/writeups/<slug>/index.md        the writeup (any single .md file works)
 *   content/writeups/<slug>/images/…        its images, referenced as images/<file>
 *
 * A plain content/writeups/<slug>.md (no images) is also accepted. Folders and
 * files starting with "_" (templates, notes) are skipped, as are writeups
 * marked `draft: true`. Drafts are still shown by `npm run dev` for previewing.
 */
import 'server-only';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { compareWriteups, createWriteup } from './writeupModel';

const WRITEUPS_DIR = path.join(process.cwd(), 'content/writeups');
const IMAGE_MANIFEST_PATH = path.join(process.cwd(), '.generated/writeup-images.json');
const SHOW_DRAFTS = process.env.NODE_ENV === 'development';

function readImageManifest() {
  if (!existsSync(IMAGE_MANIFEST_PATH)) {
    throw new Error('Image manifest missing. Run `npm run images` (it runs automatically before dev/build).');
  }
  return JSON.parse(readFileSync(IMAGE_MANIFEST_PATH, 'utf8'));
}

/** Picks a folder's Markdown file: index.md if present, else its only .md file. */
function findMarkdownFile(folderPath) {
  const markdownFiles = readdirSync(folderPath).filter((file) => file.endsWith('.md') && !file.startsWith('_'));
  if (markdownFiles.includes('index.md')) return 'index.md';
  if (markdownFiles.length === 1) return markdownFiles[0];
  if (markdownFiles.length > 1) {
    throw new Error(`${path.relative(process.cwd(), folderPath)}: found several .md files; name the writeup index.md.`);
  }
  return null; // e.g. a folder that only has images so far
}

/** Every writeup source on disk: { slug, filePath } for folders and plain .md files. */
function findWriteupSources() {
  return readdirSync(WRITEUPS_DIR, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('_') && !entry.name.startsWith('.'))
    .map((entry) => {
      const entryPath = path.join(WRITEUPS_DIR, entry.name);
      if (entry.isDirectory()) {
        const markdownFile = findMarkdownFile(entryPath);
        return markdownFile ? { slug: entry.name, filePath: path.join(entryPath, markdownFile) } : null;
      }
      if (entry.isFile() && entry.name.endsWith('.md')) {
        return { slug: entry.name.replace(/\.md$/, ''), filePath: entryPath };
      }
      return null;
    })
    .filter(Boolean);
}

/** All published writeups, newest first. Cached for the duration of a build. */
export const getAllWriteups = cache(() => {
  const imageManifest = readImageManifest();
  return findWriteupSources()
    .map(({ slug, filePath }) =>
      createWriteup({
        slug,
        source: readFileSync(filePath, 'utf8'),
        imageManifest: imageManifest[slug] ?? {},
        sourcePath: path.relative(process.cwd(), filePath),
      }),
    )
    .filter((writeup) => SHOW_DRAFTS || !writeup.isDraft)
    .sort(compareWriteups);
});

/** @returns {import('./writeupModel').Writeup | undefined} */
export function getWriteup(slug) {
  return getAllWriteups().find((writeup) => writeup.slug === slug);
}

/** Neighbouring writeups in list order (newest first), for the page footer. */
export function getAdjacentWriteups(slug) {
  const writeups = getAllWriteups();
  const index = writeups.findIndex((writeup) => writeup.slug === slug);
  return {
    newer: index > 0 ? writeups[index - 1] : null,
    older: index >= 0 && index < writeups.length - 1 ? writeups[index + 1] : null,
  };
}
