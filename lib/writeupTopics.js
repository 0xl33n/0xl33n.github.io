/**
 * Grouping writeups by their frontmatter `topic`. Kept apart from
 * writeupModel.js (which pulls in the Markdown pipeline) so client components
 * can use it.
 */
import GithubSlugger from 'github-slugger';

/** Heading for writeups without a topic, listed after every named topic. */
export const OTHER_TOPIC = 'Other';

/**
 * Groups writeups by topic for the /writeups/ page. Topics that differ only
 * in case or spacing are merged (the newest writeup's spelling wins).
 *
 * @template {{ topic: string | null }} T
 * @param {T[]} writeups - Already sorted newest first (compareWriteups).
 * @returns {{ topic: string, id: string, writeups: T[] }[]}
 *   Topics ordered by their newest writeup; "Other" (no topic) last. `id` is a URL fragment.
 */
export function groupWriteupsByTopic(writeups) {
  const groups = new Map();
  for (const writeup of writeups) {
    const key = writeup.topic?.toLowerCase();
    const isOther = !key || key === OTHER_TOPIC.toLowerCase();
    const groupKey = isOther ? null : key;
    if (!groups.has(groupKey)) groups.set(groupKey, { topic: isOther ? OTHER_TOPIC : writeup.topic, writeups: [] });
    groups.get(groupKey).writeups.push(writeup);
  }

  const ordered = [...groups.entries()].filter(([key]) => key !== null).map(([, group]) => group);
  if (groups.has(null)) ordered.push(groups.get(null));

  return ordered.map((group) => ({ ...group, id: topicId(group.topic) }));
}

/** URL fragment of a topic's section on the /writeups/ page. */
export function topicId(topic) {
  return new GithubSlugger().slug(topic);
}
