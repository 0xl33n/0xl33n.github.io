'use client';

import Link from 'next/link';
import { formatPublishedDate } from '@/components/article/formatDate';
import { classNames } from '@/lib/classNames';
import { useSelectedTopic } from './useSelectedTopic';
import styles from './WriteupList.module.css';

/**
 * @typedef {Object} WriteupSummary - What the list shows of a writeup (no article body).
 * @property {string} slug
 * @property {string} title
 * @property {string} description
 * @property {string | null} date
 * @property {string[]} tags
 * @property {boolean} isDraft
 * @property {number} readingMinutes
 */

/**
 * Writeups for the /writeups/ page, one section per topic, newest first.
 * Picking a topic (here as chips on narrow screens, or in TopicSidebar on
 * wide ones) shows only that topic.
 *
 * @param {{ topic: string, id: string, writeups: WriteupSummary[] }[]} groups - From groupWriteupsByTopic.
 */
export default function WriteupList({ groups }) {
  const [selected, select] = useSelectedTopic(groups.map((group) => group.id));

  if (groups.length === 0) {
    return <p className={styles.empty}>No writeups published yet. Check back soon.</p>;
  }

  const visibleGroups = selected ? groups.filter((group) => group.id === selected) : groups;

  const chip = (id, label, count) => (
    <li key={id ?? 'all'}>
      <a
        href={id ? `#${id}` : '#'}
        className={classNames(selected === id && styles.chipActive)}
        aria-current={selected === id ? 'page' : undefined}
        onClick={(event) => {
          event.preventDefault();
          select(id);
        }}
      >
        {label} <span className={styles.topicCount}>{count}</span>
      </a>
    </li>
  );

  return (
    <>
      {groups.length > 1 && (
        <nav className={styles.topicNav} aria-label="Topics">
          <ul>
            {chip(
              null,
              'All',
              groups.reduce((sum, group) => sum + group.writeups.length, 0),
            )}
            {groups.map((group) => chip(group.id, group.topic, group.writeups.length))}
          </ul>
        </nav>
      )}

      {visibleGroups.map((group) => (
        <section key={group.id} className={styles.topic} aria-labelledby={group.id}>
          <h2 id={group.id} className={styles.topicHeading}>
            {group.topic}{' '}
            <span className={styles.topicCount}>
              {group.writeups.length} {group.writeups.length === 1 ? 'writeup' : 'writeups'}
            </span>
          </h2>
          <ol className={styles.list}>
            {group.writeups.map((writeup) => (
              <li key={writeup.slug}>
                <WriteupItem writeup={writeup} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}

/** One writeup: a single large link with its date, title, description and tags. */
function WriteupItem({ writeup }) {
  return (
    <Link className={styles.item} href={`/writeups/${writeup.slug}/`}>
      <p className={styles.meta}>
        {writeup.isDraft && <span className={styles.draft}>Draft · </span>}
        {writeup.date && (
          <>
            <time dateTime={writeup.date}>{formatPublishedDate(writeup.date)}</time>
            <span aria-hidden="true"> · </span>
          </>
        )}
        {writeup.readingMinutes} min read
      </p>
      <h3 className={styles.title}>{writeup.title}</h3>
      <p className={styles.description}>{writeup.description}</p>
      {writeup.tags.length > 0 && (
        <ul className={styles.tags} aria-label="Tags">
          {writeup.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </Link>
  );
}
