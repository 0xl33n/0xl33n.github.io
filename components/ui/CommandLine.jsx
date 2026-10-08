import styles from './CommandLine.module.css';

/** Shell prompt line shown at the top of each section, e.g. `neel@dev $ whoami`. */
export default function CommandLine({ children }) {
  return (
    <div className={styles.commandLine}>
      <span className={styles.prompt}>neel@dev $</span> {children}
    </div>
  );
}
