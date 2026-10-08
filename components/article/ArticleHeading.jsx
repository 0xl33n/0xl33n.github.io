import styles from './ArticleContent.module.css';

/**
 * Section heading with a hover/focus "#" link to itself, so readers can share
 * a link to a specific section. Ids come from lib/markdown/rehypePlugins.js.
 */
export function createHeading(Tag) {
  function ArticleHeading({ id, children, node, ...props }) {
    if (!id) return <Tag {...props}>{children}</Tag>;
    return (
      <Tag id={id} {...props}>
        {children}
        <a className={styles.headingAnchor} href={`#${id}`} aria-label="Link to this section">
          #
        </a>
      </Tag>
    );
  }
  ArticleHeading.displayName = `ArticleHeading(${Tag})`;
  return ArticleHeading;
}
