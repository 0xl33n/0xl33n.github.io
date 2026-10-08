'use client';

import { useEffect, useState } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './ArticleLayout.module.css';

/** Headings deeper than this are left out to keep the list scannable. */
const MAX_DEPTH = 3;
const NO_IDS = [];

/**
 * Highlights the heading the reader is currently in: the last heading that
 * has scrolled above the top ~third of the viewport.
 */
function useActiveHeading(ids) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const firstVisible = elements.find((element) => visible.has(element.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      { rootMargin: '-72px 0px -66% 0px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

/**
 * Article outline. Rendered twice by the page: as a sticky sidebar on wide
 * screens and as a collapsible "Contents" box on narrow ones (CSS hides the
 * one that doesn't apply).
 *
 * @param {{ depth: number, id: string, text: string }[]} headings
 * @param {'sidebar' | 'inline'} variant
 */
export default function TableOfContents({ headings, variant }) {
  const items = headings.filter((heading) => heading.depth <= MAX_DEPTH);
  const [ids] = useState(() => items.map((item) => item.id));
  // Only the sidebar tracks the active section; the inline box is a plain list.
  const activeId = useActiveHeading(variant === 'sidebar' ? ids : NO_IDS);

  const list = (
    <ol className={styles.tocList}>
      {items.map((item) => (
        <li key={item.id} className={item.depth === 3 ? styles.tocSubItem : undefined}>
          <a
            href={`#${item.id}`}
            className={classNames(styles.tocLink, item.id === activeId && styles.tocLinkActive)}
            aria-current={item.id === activeId ? 'location' : undefined}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === 'sidebar') {
    return (
      <nav className={styles.tocSidebar} aria-label="Table of contents">
        <p className={styles.tocTitle}>Contents</p>
        {list}
      </nav>
    );
  }

  return (
    <details className={styles.tocInline}>
      <summary className={styles.tocTitle}>Contents</summary>
      <nav aria-label="Table of contents">{list}</nav>
    </details>
  );
}
