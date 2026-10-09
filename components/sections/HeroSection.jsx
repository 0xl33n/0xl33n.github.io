import Link from 'next/link';
import BlinkingCursor from '@/components/ui/BlinkingCursor';
import CommandLine from '@/components/ui/CommandLine';
import Kicker from '@/components/ui/Kicker';
import { profile } from '@/content/profile';
import { RESUME_URL } from '@/lib/site';
import styles from './HeroSection.module.css';

/** Intro: name, role, short pitch and calls to action. */
export default function HeroSection() {
  return (
    <section id="home">
      <CommandLine>whoami --full</CommandLine>
      <Kicker>product security / research</Kicker>

      <h1 className={styles.name}>
        {profile.name.toUpperCase()}
        <BlinkingCursor />
      </h1>

      <div className={styles.role}>
        <span>&gt;</span> Security Engineer<span>, building safer software</span>
      </div>

      <p className={styles.intro}>
        I break applications, APIs, mobile binaries, cloud infrastructure and network boundaries, with{' '}
        <span className={styles.emphasis}>40+ security assessments</span> behind me. Research is the other half of what
        I do, and what I do best: figuring out systems I&apos;ve never seen before, from mobile apps to custom binaries
        and protocols.
      </p>

      <ul className={styles.quickFacts}>
        {profile.quickFacts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>

      <div className={styles.actions}>
        {/* Leads with the writeups: the research is what makes people stay. */}
        <Link className={`${styles.button} ${styles.primaryButton}`} href="/writeups/">
          $ cd ~/writeups -&gt;
        </Link>
        <a className={`${styles.button} ${styles.ghostButton}`} href="#experience">
          $ cat ~/experience.log
        </a>
        <a
          className={`${styles.button} ${styles.ghostButton}`}
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          $ cat resume.pdf
        </a>
        {profile.links.github && (
          <a
            className={`${styles.button} ${styles.ghostButton}`}
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            $ open github
          </a>
        )}
      </div>
    </section>
  );
}
