import { describe, expect, it } from 'vitest';
import { splitFrontmatter } from '@/lib/markdown/frontmatter';
import { compareWriteups, createWriteup, truncate } from '@/lib/writeupModel';
import { groupWriteupsByTopic } from '@/lib/writeupTopics';

const imageManifest = {};
const create = (source, slug = 'my-writeup') => createWriteup({ slug, source, imageManifest });

describe('splitFrontmatter', () => {
  it('parses a YAML block and returns the remaining body', () => {
    const { data, body } = splitFrontmatter('---\ntitle: Hi\ntags: [a, b]\n---\n# Body');
    expect(data).toEqual({ title: 'Hi', tags: ['a', 'b'] });
    expect(body).toBe('# Body');
  });

  it('treats files without frontmatter as all body (and ignores a BOM)', () => {
    expect(splitFrontmatter('﻿# Just markdown')).toEqual({ data: {}, body: '# Just markdown' });
  });

  it('keeps dates as strings', () => {
    expect(splitFrontmatter('---\ndate: 2024-07-15\n---\n').data.date).toBe('2024-07-15');
  });
});

describe('createWriteup', () => {
  it('works with a plain Markdown file: title from # heading, description from first paragraph', () => {
    const writeup = create('# Bypassing Pinning\n\nA short intro to the technique.\n\n## Setup\n\nText.');
    expect(writeup).toMatchObject({
      slug: 'my-writeup',
      title: 'Bypassing Pinning',
      description: 'A short intro to the technique.',
      hasCustomDescription: false,
      date: null,
      tags: [],
      isDraft: false,
    });
  });

  it('prefers frontmatter values when present', () => {
    const writeup = create(
      '---\ntitle: Custom\ndescription: Custom summary.\ndate: 2025-03\ntopic: Mobile App Pentesting\ntags: [iOS, Frida]\ndraft: true\n---\n# Heading\n\nIntro.',
    );
    expect(writeup).toMatchObject({
      title: 'Custom',
      description: 'Custom summary.',
      date: '2025-03',
      topic: 'Mobile App Pentesting',
      tags: ['iOS', 'Frida'],
      isDraft: true,
    });
  });

  it('accepts a single tag written as a string', () => {
    expect(create('---\ntags: iOS\n---\n# T').tags).toEqual(['iOS']);
  });

  it('rejects folder/file names that would make bad URLs', () => {
    expect(() => create('# T', 'My Writeup')).toThrow(/lowercase words separated by hyphens/);
  });

  it('rejects malformed dates with a helpful message', () => {
    expect(() => create('---\ndate: July 2024\n---\n# T')).toThrow(/"date" must look like 2024-07/);
  });

  it('requires a title from somewhere', () => {
    expect(() => create('Just a paragraph.')).toThrow(/add a "# Title" heading/);
  });

  it('names the file in errors', () => {
    expect(() => create('---\ndate: nope\n---\n# T', 'broken')).toThrow(/content\/writeups\/broken\/index\.md/);
    expect(() =>
      createWriteup({
        slug: 'flat',
        source: '---\ndate: nope\n---\n# T',
        imageManifest: {},
        sourcePath: 'content/writeups/flat.md',
      }),
    ).toThrow(/content\/writeups\/flat\.md/);
  });

  it('only resolves images from the writeup’s own images folder', () => {
    expect(() => create('# T\n\n![x](images/other.png)')).toThrow(/images\/ folder/);
  });
});

describe('truncate', () => {
  it('cuts long text at a word boundary with an ellipsis', () => {
    const result = truncate('word '.repeat(60));
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith('word…')).toBe(true);
  });

  it('leaves short text alone', () => {
    expect(truncate('Short.')).toBe('Short.');
  });
});

describe('compareWriteups', () => {
  it('sorts newest first, undated last, then by title', () => {
    const sorted = [
      { title: 'B', date: null },
      { title: 'Old', date: '2023-01' },
      { title: 'A', date: null },
      { title: 'New', date: '2025-06-01' },
      { title: 'Mid', date: '2024-07' },
    ].sort(compareWriteups);
    expect(sorted.map((w) => w.title)).toEqual(['New', 'Mid', 'Old', 'A', 'B']);
  });
});

describe('groupWriteupsByTopic', () => {
  const writeup = (slug, topic) => ({ slug, topic });

  it('has no topic when the frontmatter leaves it out', () => {
    expect(create('# Title\n\nIntro.').topic).toBeNull();
  });

  it('groups by topic in the order of each topic\'s newest writeup, with "Other" last', () => {
    const groups = groupWriteupsByTopic([
      writeup('a', 'Heap Exploitation'),
      writeup('b', null),
      writeup('c', 'Mobile App Pentesting'),
      writeup('d', 'Heap Exploitation'),
    ]);
    expect(groups.map((group) => [group.topic, group.id, group.writeups.map((w) => w.slug)])).toEqual([
      ['Heap Exploitation', 'heap-exploitation', ['a', 'd']],
      ['Mobile App Pentesting', 'mobile-app-pentesting', ['c']],
      ['Other', 'other', ['b']],
    ]);
  });

  it('merges topics that differ only in case, and treats "Other" as no topic', () => {
    const groups = groupWriteupsByTopic([
      writeup('a', 'Heap'),
      writeup('b', 'heap'),
      writeup('c', 'other'),
      writeup('d', null),
    ]);
    expect(groups.map((group) => [group.topic, group.writeups.length])).toEqual([
      ['Heap', 2],
      ['Other', 2],
    ]);
  });
});
