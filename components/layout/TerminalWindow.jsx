'use client';

import { useEffect, useRef, useState } from 'react';
import useWindowState from '@/hooks/useWindowState';
import { classNames } from '@/lib/classNames';
import WindowControls from './WindowControls';
import styles from './TerminalWindow.module.css';

const NAV_LINKS = [
  { href: '#experience', label: '~/experience' },
  { href: '#work', label: '~/work' },
  { href: '#writeups', label: '~/writeups' },
  { href: '#awards', label: '~/awards' },
  { href: '#stack', label: '~/stack' },
  { href: '#contact', label: '~/contact' },
];

/**
 * Full-screen message shown when the window is closed or minimized, with a
 * focused button so Enter/Space brings the site straight back.
 */
function ParkedScreen({ message, actionLabel, onAction }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div className={styles.parkedScreen} role="status">
      <div>
        <div>&gt; {message}</div>
        <button ref={buttonRef} type="button" className={styles.parkedButton} onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

/**
 * Fake terminal window wrapping the page content. Owns the close / minimize /
 * maximize state so the page itself stays a static Server Component.
 *
 * Close and minimize are playful easter eggs, so both are trivially undoable.
 */
export default function TerminalWindow({ children }) {
  const [isClosed, setIsClosed] = useState(false);
  const { isMinimized, isMaximized, toggleMinimized, toggleMaximized } = useWindowState();

  if (isClosed) {
    return (
      <ParkedScreen message="terminal session closed." actionLabel="reopen ~/dev" onAction={() => setIsClosed(false)} />
    );
  }

  return (
    <>
      {isMinimized && (
        <ParkedScreen message="~/dev minimized to the dock." actionLabel="restore window" onAction={toggleMinimized} />
      )}

      {/* Hidden rather than unmounted while minimized, so content keeps its state. */}
      <div className={classNames(styles.window, isMaximized && styles.maximized)} hidden={isMinimized}>
        <header className={styles.titleBar}>
          <WindowControls
            target="terminal"
            onClose={() => setIsClosed(true)}
            onMinimize={toggleMinimized}
            onMaximize={toggleMaximized}
          />

          <div className={styles.path}>
            <b>neel</b>@portfolio: <b>~/dev</b>
          </div>

          <nav className={styles.nav} aria-label="Primary navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className={styles.status}>
            <span className={styles.statusDot} />
            available for work
          </div>
        </header>

        {children}
      </div>
    </>
  );
}
