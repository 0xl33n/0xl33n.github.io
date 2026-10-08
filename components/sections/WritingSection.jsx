import Link from 'next/link';
import CommandLine from '@/components/ui/CommandLine';
import commandLineStyles from '@/components/ui/CommandLine.module.css';
import SectionHeading from '@/components/ui/SectionHeading';
import { getAllWriteups } from '@/lib/writeups';
import { groupWriteupsByTopic } from '@/lib/writeupTopics';
import styles from './WritingSection.module.css';

/**
 * Introduces the writeups and links to the /writeups/ page, rather than
 * listing individual articles. Topics link straight to their section there.
 */
export default function WritingSection() {
  const writeups = getAllWriteups();
  if (writeups.length === 0) return null;

  const topics = groupWriteupsByTopic(writeups);

  return (
    <section id="writeups">
      <CommandLine>
        cat ~/writeups/README.md{' '}
        <span className={commandLineStyles.comment}>
          # {writeups.length} {writeups.length === 1 ? 'writeup' : 'writeups'}
        </span>
      </CommandLine>

      <SectionHeading kicker="writeups" annotation="// cat *.md">
        Notes from the lab
      </SectionHeading>

      <div className={styles.intro}>
        <p>
          Deep dives into whatever I&apos;m researching, from reverse engineering to exploitation. Each writeup walks
          through the problem, the approach and the details, so you can follow along and try it yourself.
        </p>

        <ul className={styles.topics} aria-label="Topics">
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link href={`/writeups/#${topic.id}`}>{topic.topic}</Link>
            </li>
          ))}
        </ul>
      </div>

      <Link className={styles.allLink} href="/writeups/">
        $ cd ~/writeups → all writeups
      </Link>
    </section>
  );
}
