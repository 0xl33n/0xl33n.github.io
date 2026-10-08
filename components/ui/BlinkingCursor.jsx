import styles from './BlinkingCursor.module.css';

/** Terminal-style blinking cursor character. */
export default function BlinkingCursor({ character = '_' }) {
  return <span className={styles.cursor}>{character}</span>;
}
