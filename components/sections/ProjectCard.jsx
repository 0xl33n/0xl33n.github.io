import FileCard from '@/components/ui/FileCard';
import TagList from '@/components/ui/TagList';
import styles from './ProjectCard.module.css';

/**
 * Project card with its highlights inline. If the project has a writeup, the
 * whole card links to it.
 *
 * @param {import('@/content/projects').Project} project
 * @param {import('@/lib/writeupModel').Writeup} [writeup] - The linked writeup, if any.
 */
export default function ProjectCard({ project, writeup }) {
  return (
    <FileCard
      href={writeup ? `/writeups/${writeup.slug}/` : undefined}
      title={project.name}
      badge={project.type}
      meta={project.period ?? '-rwxr-xr-x'}
      description={project.description}
    >
      <ul className={styles.highlights}>
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <TagList items={project.tags} />
      {writeup && (
        <div className={styles.footer}>
          <span className={styles.readLink}>→ read the writeup</span>
          <span className={styles.readingTime}>{writeup.readingMinutes} min read</span>
        </div>
      )}
    </FileCard>
  );
}
