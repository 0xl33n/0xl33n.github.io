import Kicker from './Kicker';
import styles from './SectionHeading.module.css';

/**
 * Kicker + section title pair.
 *
 * @param {string} kicker - Label shown above the title.
 * @param {React.ReactNode} [annotation] - Dimmed trailing text, e.g. `// drwxr-xr-x`.
 */
export default function SectionHeading({ kicker, annotation, children }) {
  return (
    <div className={styles.heading}>
      <Kicker>{kicker}</Kicker>
      <h2 className={styles.title}>
        {children}
        {annotation && (
          <>
            {' '}
            <span className={styles.annotation}>{annotation}</span>
          </>
        )}
      </h2>
    </div>
  );
}
