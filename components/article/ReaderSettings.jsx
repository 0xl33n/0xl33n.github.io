'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { classNames } from '@/lib/classNames';
import styles from './ReaderSettings.module.css';
import { useFirstVisitTip } from './ThemeTip';

const FONT_CHOICES = [
  { value: 'mono', label: 'Mono', className: styles.monoSample },
  { value: 'sans', label: 'Sans', className: styles.sansSample },
  { value: 'serif', label: 'Serif', className: styles.serifSample },
];

/** Each theme button shows a swatch of that theme's background and accent. */
const THEME_CHOICES = [
  { value: 'terminal', label: 'Terminal', swatch: styles.swatchTerminal },
  { value: 'light', label: 'Light', swatch: styles.swatchLight },
  { value: 'dark', label: 'Dark', swatch: styles.swatchDark },
];

/**
 * Row of mutually exclusive toggle buttons (one is always pressed).
 *
 * @param {string} label - Visible group label.
 * @param {{ value: string, label: string, className?: string }[]} choices
 */
function SegmentedControl({ label, choices, value, onChange }) {
  const labelId = useId();
  return (
    <div className={styles.row}>
      <span id={labelId} className={styles.rowLabel}>
        {label}
      </span>
      <div className={styles.segmented} role="group" aria-labelledby={labelId}>
        {choices.map((choice) => (
          <button
            key={choice.value}
            type="button"
            className={`${styles.segment} ${choice.className ?? ''}`}
            aria-pressed={value === choice.value}
            onClick={() => onChange(choice.value)}
          >
            {choice.swatch && <span className={`${styles.swatch} ${choice.swatch}`} aria-hidden="true" />}
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * "Aa Theme" button plus the reading-settings popover (theme, font, text
 * size), modelled on Safari Reader's appearance menu. First-time visitors see
 * a tip about it below the toolbar (ThemeTip, rendered by ReaderShell).
 *
 * Open state is owned by the parent so it can close the menu when the
 * article changes.
 *
 * @param {boolean} isOpen
 * @param {(isOpen: boolean) => void} onOpenChange
 * @param {ReturnType<typeof import('@/hooks/useReaderPreferences').default>} preferences
 */
export default function ReaderSettings({ isOpen, onOpenChange, preferences }) {
  const panelId = useId();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  useClickOutside([triggerRef, panelRef], close, isOpen);
  const tip = useFirstVisitTip();

  // Move focus into the panel when it opens so keyboard users land on the controls.
  useEffect(() => {
    if (isOpen) panelRef.current?.querySelector('button:not(:disabled)')?.focus();
  }, [isOpen]);

  // Escape closes only this menu: stopping propagation keeps the reader's
  // window-level Escape handler from also closing the article.
  const handleKeyDown = (event) => {
    if (event.key !== 'Escape' || !isOpen) return;
    event.stopPropagation();
    close();
    triggerRef.current?.focus();
  };

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className={classNames(styles.trigger, tip.isVisible && styles.triggerHighlighted)}
        aria-label="Reading settings: theme, font and text size"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => {
          // Opening the menu means the reader has found it: retire the tip.
          if (!isOpen && tip.isVisible) tip.dismiss();
          onOpenChange(!isOpen);
        }}
      >
        <span className={styles.triggerIcon} aria-hidden="true">
          <span className={styles.triggerSmallA}>A</span>
          <span className={styles.triggerLargeA}>A</span>
        </span>
        <span className={styles.triggerLabel}>Theme</span>
      </button>

      {isOpen && (
        <div ref={panelRef} id={panelId} className={styles.panel} role="dialog" aria-label="Reading settings">
          <SegmentedControl
            label="Theme"
            choices={THEME_CHOICES}
            value={preferences.theme}
            onChange={preferences.setTheme}
          />

          <div className={styles.row}>
            <span className={styles.rowLabel}>Text size</span>
            <div className={styles.stepper}>
              <button
                type="button"
                className={styles.stepButton}
                onClick={preferences.decreaseTextSize}
                disabled={!preferences.canDecreaseTextSize}
                aria-label="Decrease text size"
              >
                <span className={styles.stepSmallA}>A</span>
              </button>
              <span className={styles.stepValue} aria-live="polite">
                {preferences.textSize}px
              </span>
              <button
                type="button"
                className={styles.stepButton}
                onClick={preferences.increaseTextSize}
                disabled={!preferences.canIncreaseTextSize}
                aria-label="Increase text size"
              >
                <span className={styles.stepLargeA}>A</span>
              </button>
            </div>
          </div>

          <SegmentedControl
            label="Font"
            choices={FONT_CHOICES}
            value={preferences.fontFamily}
            onChange={preferences.setFontFamily}
          />
        </div>
      )}
    </div>
  );
}
