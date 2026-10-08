import CommandLine from '@/components/ui/CommandLine';
import FileCard from '@/components/ui/FileCard';
import SectionHeading from '@/components/ui/SectionHeading';
import TagList from '@/components/ui/TagList';
import { award } from '@/content/profile';
import { sitePath } from '@/lib/site';
import styles from './AwardsSection.module.css';

export default function AwardsSection() {
  return (
    <section id="awards">
      <CommandLine>cat ~/awards.txt</CommandLine>

      <SectionHeading kicker="awards & challenges" annotation="// gpg --verify letter.sig">
        Recognition through hands-on security research
      </SectionHeading>

      <FileCard title={award.title} badge={award.badge} meta={award.year} description={award.summary}>
        <p className={styles.details}>{award.details}</p>

        {/* The medallion NSA sends solvers, and the letter that came with it. Each opens full size. */}
        <div className={styles.evidence}>
          <ul className={styles.photos}>
            {award.photos.map((photo) => (
              <li key={photo.small}>
                <a href={sitePath(photo.large)} target="_blank" rel="noopener noreferrer">
                  <img
                    src={sitePath(photo.small)}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                  />
                </a>
                <span className={styles.caption}>{photo.caption}</span>
              </li>
            ))}
          </ul>
          <a className={styles.letterLink} href={sitePath(award.letter.href)} target="_blank" rel="noopener noreferrer">
            → view {award.letter.label}
          </a>
        </div>

        <TagList items={award.tags} highlightIndex={award.tags.length - 1} />
      </FileCard>
    </section>
  );
}
