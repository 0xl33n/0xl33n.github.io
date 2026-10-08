import CommandLine from '@/components/ui/CommandLine';
import { systemInfo } from '@/content/profile';
import styles from './NeofetchSection.module.css';

const AVATAR_ASCII_ART = String.raw`       .--------.
      /  .----.  \
     /  /      \  \
    |  |  .--.  |  |
    |  | ( o  ) |  |
    |  |  '--'  |  |
    |   \  __  /   |
     \   '----'   /
      '----------'
       |  ||  |
    ___|__||__|___
   /___/      \___/`;

/** Colors are assigned by position in the CSS (nth-child). */
const COLOR_SWATCH_COUNT = 8;

/** "neofetch"-style profile card: ASCII avatar + key/value system info. */
export default function NeofetchSection() {
  return (
    <section>
      <CommandLine>neofetch</CommandLine>

      <div className={styles.panel}>
        <div className={styles.avatar}>
          <pre className={styles.asciiArt}>{AVATAR_ASCII_ART}</pre>
          <div className={styles.avatarLabel}>neel@dev</div>
        </div>

        <div>
          <div className={styles.infoTitle}>
            <span>neel@portfolio</span> ----------
          </div>

          <dl className={styles.infoList}>
            {systemInfo.map(({ label, value, isHighlighted }) => (
              <div key={label} className={styles.infoRow}>
                <dt>{label}:</dt>
                <dd className={isHighlighted ? styles.highlightedValue : undefined}>{value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.colorSwatches}>
            {Array.from({ length: COLOR_SWATCH_COUNT }, (_, index) => (
              <i key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
