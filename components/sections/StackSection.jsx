import CommandLine from '@/components/ui/CommandLine';
import SectionHeading from '@/components/ui/SectionHeading';
import TagList from '@/components/ui/TagList';
import { classNames } from '@/lib/classNames';
import { skillGroups } from '@/content/profile';
import styles from './StackSection.module.css';

/** Skills and tools, grouped into cards. */
export default function StackSection() {
  return (
    <section id="stack">
      <CommandLine>cat stack.txt | sort -r</CommandLine>
      <SectionHeading kicker="stack">Technologies, skills &amp; tools</SectionHeading>

      <div className={styles.stackGrid}>
        {skillGroups.map((group) => (
          <div key={group.label} className={classNames(styles.stackCard, group.isFullWidth && styles.fullWidth)}>
            <div className={styles.cardHeader}>
              <span className={styles.groupIndex}>{group.index}</span>
              <span className={styles.groupLabel}>{group.label}</span>
            </div>
            <TagList items={group.items} highlightIndex={null} variant="spacious" />
          </div>
        ))}
      </div>
    </section>
  );
}
