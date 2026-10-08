import CommandLine from '@/components/ui/CommandLine';
import SectionHeading from '@/components/ui/SectionHeading';
import { education, experience } from '@/content/profile';
import styles from './ExperienceSection.module.css';

/** Work history and education, styled as a log file. */
export default function ExperienceSection() {
  return (
    <section id="experience">
      <CommandLine>cat ~/experience.log</CommandLine>
      <SectionHeading kicker="experience" annotation="// tail -n 20">
        Where I&apos;ve done the work
      </SectionHeading>

      <ol className={styles.timeline}>
        {experience.map((job) => (
          <li key={`${job.organization}-${job.period}`} className={styles.entry}>
            <div className={styles.period}>{job.period}</div>
            <div className={styles.body}>
              <h3 className={styles.role}>
                {job.role} <span className={styles.at}>@</span> {job.organization}
              </h3>
              <p className={styles.meta}>
                {job.formerName && <>formerly {job.formerName} · </>}
                {job.location}
              </p>
              <ul className={styles.highlights}>
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}

        {education.map((entry) => (
          <li key={entry.school} className={styles.entry}>
            <div className={styles.period}>{entry.period}</div>
            <div className={styles.body}>
              <h3 className={styles.role}>
                {entry.degree} <span className={styles.at}>@</span> {entry.school}
              </h3>
              <p className={styles.meta}>Coursework: {entry.coursework}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
