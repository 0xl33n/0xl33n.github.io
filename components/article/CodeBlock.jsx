'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ArticleContent.module.css';

const COPIED_MESSAGE_MS = 2000;

/** <pre> with a "Copy" button. Receives the highlighted <code> element as children. */
export default function CodeBlock({ children, ...props }) {
  const preRef = useRef(null);
  const [copyState, setCopyState] = useState('idle'); // 'idle' | 'copied' | 'failed'

  useEffect(() => {
    if (copyState === 'idle') return undefined;
    const timeout = setTimeout(() => setCopyState('idle'), COPIED_MESSAGE_MS);
    return () => clearTimeout(timeout);
  }, [copyState]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(preRef.current?.innerText ?? '');
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const label = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' }[copyState];

  return (
    <div className={styles.codeBlock}>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button type="button" className={styles.copyButton} onClick={copy} aria-live="polite">
        {label}
      </button>
    </div>
  );
}
