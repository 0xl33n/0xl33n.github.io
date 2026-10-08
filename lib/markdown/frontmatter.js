import { parse } from 'yaml';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/**
 * Splits an optional YAML frontmatter block off the top of a Markdown file.
 *
 * @param {string} source
 * @returns {{ data: Record<string, unknown>, body: string }}
 */
export function splitFrontmatter(source) {
  const text = source.replace(/^﻿/, ''); // editors sometimes add a byte-order mark
  const match = FRONTMATTER.exec(text);
  if (!match) return { data: {}, body: text };

  const data = parse(match[1]) ?? {};
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Frontmatter must be a set of "key: value" lines.');
  }
  return { data, body: text.slice(match[0].length) };
}
