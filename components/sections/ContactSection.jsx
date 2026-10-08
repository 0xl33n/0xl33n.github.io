import CommandLine from '@/components/ui/CommandLine';
import { profile } from '@/content/profile';
import { RESUME_URL } from '@/lib/site';
import styles from './ContactSection.module.css';

/** Closing call to action: connect on LinkedIn, plus GitHub (if set) and the résumé. */
export default function ContactSection() {
  const secondaryLinks = [
    { label: 'github', href: profile.links.github },
    { label: 'resume.pdf', href: RESUME_URL },
  ].filter((link) => link.href);

  return (
    <section id="contact">
      <CommandLine>./contact --hire</CommandLine>

      <div className={styles.callToAction}>
        <h2 className={styles.title}>
          Let&apos;s <span>build something secure</span> together.
        </h2>
        <p className={styles.pitch}>
          Looking for product security, application security and security engineering work where finding the bug is only
          half the job.
        </p>

        <a className={styles.primaryButton} href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
          $ connect --linkedin →
        </a>

        <div className={styles.socialLinks}>
          {secondaryLinks.map(({ label, href }) => (
            <a key={label} className={styles.socialLink} href={href} target="_blank" rel="noopener noreferrer">
              → {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
