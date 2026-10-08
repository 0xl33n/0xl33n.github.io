'use client';

import { useSyncExternalStore } from 'react';
import styles from './ReaderSettings.module.css';

/** localStorage key remembering that the reader has seen (or dismissed) the theme tip. */
const TIP_SEEN_KEY = 'reader-theme-tip-seen';
const TIP_SEEN_EVENT = 'reader-theme-tip-seen';

function hasSeenTip() {
  try {
    return window.localStorage.getItem(TIP_SEEN_KEY) === '1';
  } catch {
    return false; // storage unavailable: treat as unseen
  }
}

function subscribeToTipSeen(onChange) {
  window.addEventListener(TIP_SEEN_EVENT, onChange);
  return () => window.removeEventListener(TIP_SEEN_EVENT, onChange);
}

function markTipSeen() {
  try {
    window.localStorage.setItem(TIP_SEEN_KEY, '1');
  } catch {
    // Not persisting is fine: the tip may show again next visit.
  }
  window.dispatchEvent(new Event(TIP_SEEN_EVENT));
}

/**
 * Whether the one-time theme tip should show. Server render (and hydration)
 * assume "seen", so the tip appears only after load and never mismatches.
 * Every caller shares the same state: dismissing one tip hides them all.
 */
export function useFirstVisitTip() {
  const isSeen = useSyncExternalStore(subscribeToTipSeen, hasSeenTip, () => true);
  return { isVisible: !isSeen, dismiss: markTipSeen };
}

/**
 * One-time tip telling readers where to change the theme, without a blocking
 * pop-up. It sits in the page flow below the toolbar, aligned with the text,
 * so it pushes the page down rather than covering the article header (a
 * popover under the button would overlap the text on most screen widths and
 * text sizes).
 */
export default function ThemeTip() {
  const tip = useFirstVisitTip();
  if (!tip.isVisible) return null;

  return (
    <div className={styles.tip} role="note">
      <p className={styles.tipText}>
        Switch between <strong>Terminal</strong>, <strong>Light</strong> and <strong>Dark</strong>, or change the font
        and text size, with the {/* A small copy of the toolbar button, which glows while this tip is showing. */}
        <span className={styles.tipButton} aria-hidden="true">
          <span className={styles.triggerIcon}>
            <span className={styles.triggerSmallA}>A</span>
            <span className={styles.triggerLargeA}>A</span>
          </span>{' '}
          Theme
        </span>
        <span className={styles.visuallyHidden}>Theme</span> button at the top right.
      </p>
      <button type="button" className={styles.tipDismiss} onClick={tip.dismiss}>
        Got it
      </button>
    </div>
  );
}
