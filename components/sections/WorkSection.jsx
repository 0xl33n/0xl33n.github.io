import CommandLine from '@/components/ui/CommandLine';
import commandLineStyles from '@/components/ui/CommandLine.module.css';
import SectionHeading from '@/components/ui/SectionHeading';
import { projects } from '@/content/projects';
import { getWriteup } from '@/lib/writeups';
import ProjectCard from './ProjectCard';
import styles from './WorkSection.module.css';

/** Project cards; featured projects span the full width. */
export default function WorkSection() {
  return (
    <section id="work">
      <CommandLine>
        ls -la ~/projects <span className={commandLineStyles.comment}># {projects.length} selected</span>
      </CommandLine>

      <SectionHeading kicker="selected work" annotation="// drwxr-xr-x">
        Things I built and researched
      </SectionHeading>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <div key={project.id} className={project.isFeatured ? styles.featured : undefined}>
            <ProjectCard project={project} writeup={project.writeup ? getWriteup(project.writeup) : undefined} />
          </div>
        ))}
      </div>
    </section>
  );
}
