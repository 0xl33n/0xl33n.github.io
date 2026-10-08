import styles from './Kicker.module.css';

/** Small uppercase label prefixed with `>`. */
export default function Kicker({ children }) {
  return <div className={styles.kicker}>&gt; {children}</div>;
}
