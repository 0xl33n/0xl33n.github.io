import Link from 'next/link';
import styles from './ArticleLayout.module.css';

/**
 * End-of-writeup navigation: neighbouring writeups and a link to the full list.
 *
 * @param {{ newer: import('@/lib/writeupModel').Writeup | null, older: import('@/lib/writeupModel').Writeup | null }} props
 */
export default function ArticleFooter({ newer, older }) {
  return (
    <footer className={styles.footer}>
      {(newer || older) && (
        <nav className={styles.pager} aria-label="More writeups">
          {newer ? (
            <Link className={styles.pagerLink} href={`/writeups/${newer.slug}/`}>
              <span className={styles.pagerLabel}>← Newer</span>
              <span className={styles.pagerTitle}>{newer.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link className={`${styles.pagerLink} ${styles.pagerNext}`} href={`/writeups/${older.slug}/`}>
              <span className={styles.pagerLabel}>Older →</span>
              <span className={styles.pagerTitle}>{older.title}</span>
            </Link>
          )}
        </nav>
      )}
      <Link className={styles.backLink} href="/writeups/">
        ← All writeups
      </Link>
    </footer>
  );
}
