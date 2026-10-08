import Link from 'next/link';
import { topicId } from '@/lib/writeupTopics';
import { formatPublishedDate } from './formatDate';
import styles from './ArticleLayout.module.css';

/**
 * Title block: kicker (topic · date · reading time), title, standfirst and tags.
 * The topic links to its section on the /writeups/ page.
 *
 * @param {import('@/lib/writeupModel').Writeup} writeup
 */
export default function ArticleHeader({ writeup }) {
  const publishedLabel = formatPublishedDate(writeup.date);
  return (
    <header className={styles.header}>
      <p className={styles.kicker}>
        {writeup.isDraft && <span className={styles.draftBadge}>Draft</span>}
        {writeup.isDraft && writeup.topic && <span aria-hidden="true"> · </span>}
        {writeup.topic && (
          <Link className={styles.kickerLink} href={`/writeups/#${topicId(writeup.topic)}`}>
            {writeup.topic}
          </Link>
        )}
        {!writeup.isDraft && !writeup.topic && <span>Writeup</span>}
        {publishedLabel && (
          <>
            <span aria-hidden="true"> · </span>
            <time dateTime={writeup.date}>{publishedLabel}</time>
          </>
        )}
        <span aria-hidden="true"> · </span>
        <span>{writeup.readingMinutes} min read</span>
      </p>
      <h1 className={styles.title}>{writeup.title}</h1>
      {/* Without a custom description, the fallback is the first paragraph, which the body already shows. */}
      {writeup.hasCustomDescription && <p className={styles.standfirst}>{writeup.description}</p>}
      {writeup.tags.length > 0 && (
        <ul className={styles.tags} aria-label="Tags">
          {writeup.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </header>
  );
}
