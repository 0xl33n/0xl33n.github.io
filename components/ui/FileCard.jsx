import Link from 'next/link';
import { classNames } from '@/lib/classNames';
import styles from './FileCard.module.css';

/**
 * Card styled like a directory listing entry: `name/` on the left, a badge and
 * permissions-style metadata on the right, then a description.
 *
 * Pass `href` to make the whole card a link (with hover lift and focus ring).
 *
 * @param {string} title - Rendered as an <h3> with a trailing `/`.
 * @param {string} badge - Highlighted label, rendered as `★ badge`.
 * @param {string} meta - Dimmed label next to the badge.
 * @param {React.ReactNode} description - Main paragraph.
 * @param {string} [href] - Internal link target.
 */
export default function FileCard({ title, badge, meta, description, href, children }) {
  const content = (
    <>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {title}
          <span aria-hidden="true">/</span>
        </h3>
        <div className={styles.stats}>
          <span className={styles.badge}>★ {badge}</span>
          <span className={styles.meta}>{meta}</span>
        </div>
      </div>
      <p className={styles.description}>{description}</p>
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classNames(styles.card, styles.interactive)}>
        {content}
      </Link>
    );
  }
  return <div className={styles.card}>{content}</div>;
}
