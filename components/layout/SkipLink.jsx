import styles from './SkipLink.module.css';

/** First focusable element on every page: lets keyboard users jump past the navigation. */
export default function SkipLink() {
  return (
    <a className={styles.skipLink} href="#main">
      Skip to content
    </a>
  );
}
