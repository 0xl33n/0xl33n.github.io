import BlinkingCursor from '@/components/ui/BlinkingCursor';
import { profile } from '@/content/profile';
import styles from './SiteFooter.module.css';

// Captured at build time. GITHUB_SHA is set by GitHub Actions.
const BUILD_DATE = new Date();
const COMMIT = process.env.GITHUB_SHA?.slice(0, 7) ?? 'local';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        $ echo &quot;(c) {BUILD_DATE.getUTCFullYear()} {profile.name}, built in the terminal, shipped securely&quot;{' '}
        <BlinkingCursor character="█" />
      </div>
      <div className={styles.buildInfo}>
        build: main@{COMMIT} · <time dateTime={BUILD_DATE.toISOString()}>{BUILD_DATE.toISOString().slice(0, 10)}</time>
      </div>
    </footer>
  );
}
