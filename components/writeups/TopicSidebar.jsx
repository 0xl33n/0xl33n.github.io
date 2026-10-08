'use client';

import layoutStyles from '@/components/article/ArticleLayout.module.css';
import { classNames } from '@/lib/classNames';
import { useSelectedTopic } from './useSelectedTopic';
import styles from './WriteupList.module.css';

/**
 * Topic picker in the left gutter of the /writeups/ page on wide screens,
 * styled like an article's table of contents. Narrow screens use the chips
 * above the list instead (WriteupList).
 *
 * @param {{ topic: string, id: string, writeups: object[] }[]} groups
 * @param {number} total - Number of writeups across all topics.
 */
export default function TopicSidebar({ groups, total }) {
  const [selected, select] = useSelectedTopic(groups.map((group) => group.id));

  const item = (id, label, count) => {
    const isActive = selected === id;
    return (
      <li key={id ?? 'all'}>
        <a
          href={id ? `#${id}` : '#'}
          className={classNames(layoutStyles.tocLink, styles.sidebarLink, isActive && layoutStyles.tocLinkActive)}
          aria-current={isActive ? 'page' : undefined}
          onClick={(event) => {
            event.preventDefault();
            select(id);
            window.scrollTo({ top: 0 });
          }}
        >
          <span>{label}</span> <span className={styles.sidebarCount}>{count}</span>
        </a>
      </li>
    );
  };

  return (
    <nav className={layoutStyles.tocSidebar} aria-label="Topics">
      <p className={layoutStyles.tocTitle}>Topics</p>
      <ul className={layoutStyles.tocList}>
        {item(null, 'All writeups', total)}
        {groups.map((group) => item(group.id, group.topic, group.writeups.length))}
      </ul>
    </nav>
  );
}
