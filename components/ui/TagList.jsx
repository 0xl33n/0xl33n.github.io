import { classNames } from '@/lib/classNames';
import styles from './TagList.module.css';

/**
 * Wrapping list of tag chips.
 *
 * @param {string[]} items - Tag labels.
 * @param {number | null} [highlightIndex=3] - Index of the tag drawn in the highlight color; `null` for none.
 * @param {'compact' | 'spacious'} [variant='compact'] - `spacious` is used in the stack grid.
 */
export default function TagList({ items, highlightIndex = 3, variant = 'compact' }) {
  return (
    <div className={classNames(styles.tagList, styles[variant])}>
      {items.map((item, index) => (
        <span key={item} className={classNames(styles.tag, index === highlightIndex && styles.highlighted)}>
          {item}
        </span>
      ))}
    </div>
  );
}
