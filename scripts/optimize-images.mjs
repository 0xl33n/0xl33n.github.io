/**
 * Converts each writeup's images (content/writeups/<slug>/images/, original
 * PNG/JPG exports) into web-ready WebP files in public/images/writeups/<slug>/,
 * and writes a manifest with each image's paths and dimensions, keyed by
 * writeup slug, then file name.
 *
 * Each image gets up to two widths so browsers can pick via srcset: a small
 * one for phones and 1x screens, a large one for high-density screens and
 * the lightbox.
 *
 * Runs automatically before `dev` and `build`. Unchanged images are skipped,
 * so repeat runs are fast. Outputs are generated and git-ignored.
 *
 * Usage: node scripts/optimize-images.mjs [--force]
 */
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const WRITEUPS_DIR = path.join(ROOT, 'content/writeups');
const OUTPUT_ROOT = path.join(ROOT, 'public/images/writeups');
const MANIFEST_PATH = path.join(ROOT, '.generated/writeup-images.json');

/** Output widths: 800px covers phones and 1x desktop columns; 1600px covers 2x screens and the lightbox. */
const WIDTHS = [800, 1600];
const WEBP_QUALITY = 82;
const SOURCE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const force = process.argv.includes('--force');

async function isUpToDate(sourcePath, outputPath) {
  try {
    const [source, output] = await Promise.all([stat(sourcePath), stat(outputPath)]);
    return output.mtimeMs >= source.mtimeMs;
  } catch {
    return false;
  }
}

async function listDirectory(directory) {
  try {
    return await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }
}

/** Writes each size of one image and returns its manifest entry. */
async function optimizeImage(slug, sourceDir, file, stats) {
  const sourcePath = path.join(sourceDir, file);
  const outputDir = path.join(OUTPUT_ROOT, slug);
  const baseName = path.parse(file).name;
  const { width: sourceWidth } = await sharp(sourcePath).metadata();

  // Never upscale: widths larger than the original collapse to the original width.
  const targetWidths = [...new Set(WIDTHS.map((width) => Math.min(width, sourceWidth)))];
  const variants = [];

  for (const [index, targetWidth] of targetWidths.entries()) {
    const isLargest = index === targetWidths.length - 1;
    const outputName = isLargest ? `${baseName}.webp` : `${baseName}-${targetWidth}w.webp`;
    const outputPath = path.join(outputDir, outputName);

    if (force || !(await isUpToDate(sourcePath, outputPath))) {
      await sharp(sourcePath).resize({ width: targetWidth }).webp({ quality: WEBP_QUALITY }).toFile(outputPath);
      stats.written += 1;
    }
    const { width, height } = await sharp(outputPath).metadata();
    variants.push({ src: `/images/writeups/${slug}/${outputName}`, width, height });
    stats.outputBytes += (await stat(outputPath)).size;
  }

  stats.sourceBytes += (await stat(sourcePath)).size;
  const largest = variants.at(-1);
  return {
    src: largest.src,
    width: largest.width,
    height: largest.height,
    srcset: variants.map(({ src, width }) => ({ src, width })),
  };
}

async function main() {
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  // Start clean so images removed or renamed in content/ don't linger in public/.
  if (force) await rm(OUTPUT_ROOT, { recursive: true, force: true });

  const stats = { images: 0, written: 0, sourceBytes: 0, outputBytes: 0 };
  const manifest = {};

  const writeupFolders = (await listDirectory(WRITEUPS_DIR)).filter(
    (entry) => entry.isDirectory() && !entry.name.startsWith('_'),
  );

  for (const folder of writeupFolders) {
    const slug = folder.name;
    // Skip folders without a writeup yet (e.g. images uploaded for an unsaved draft), so they're never published.
    const hasMarkdown = (await listDirectory(path.join(WRITEUPS_DIR, slug))).some(
      (entry) => entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_'),
    );
    if (!hasMarkdown) continue;
    const sourceDir = path.join(WRITEUPS_DIR, slug, 'images');
    const files = (await listDirectory(sourceDir))
      .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort();
    if (files.length === 0) continue;

    await mkdir(path.join(OUTPUT_ROOT, slug), { recursive: true });
    manifest[slug] = {};
    for (const file of files) {
      manifest[slug][file] = await optimizeImage(slug, sourceDir, file, stats);
      stats.images += 1;
    }
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(1);
  console.log(
    `[images] ${stats.images} images in ${Object.keys(manifest).length} writeup(s) (${stats.written} files written): ` +
      `${toMB(stats.sourceBytes)} MB originals -> ${toMB(stats.outputBytes)} MB WebP (all sizes)`,
  );
}

main().catch((error) => {
  console.error('[images] failed:', error);
  process.exit(1);
});
