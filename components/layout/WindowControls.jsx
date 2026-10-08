import Link from 'next/link';
import styles from './WindowControls.module.css';

const CONTROLS = [
  { key: 'close', label: 'Close', className: styles.close },
  { key: 'minimize', label: 'Minimize', className: styles.minimize },
  { key: 'maximize', label: 'Maximize', className: styles.maximize },
];

/**
 * macOS-style close / minimize / maximize dots.
 *
 * Controls with a handler render as buttons; the rest are purely decorative.
 * Close can instead be a link (`closeHref`), which works before JavaScript loads.
 * Each control has a 24×24px hit area (WCAG 2.5.8) around a 10px dot.
 *
 * @param {string} target - Used in labels, e.g. "terminal" → "Close terminal".
 * @param {() => void} [onClose]
 * @param {string} [closeHref] - Makes the close dot a link instead of a button.
 * @param {() => void} [onMinimize]
 * @param {() => void} [onMaximize]
 */
export default function WindowControls({ target, onClose, closeHref, onMinimize, onMaximize }) {
  const handlers = { close: onClose, minimize: onMinimize, maximize: onMaximize };

  return (
    <div className={styles.controls}>
      {CONTROLS.map(({ key, label, className }) =>
        key === 'close' && closeHref ? (
          <Link
            key={key}
            href={closeHref}
            className={`${styles.control} ${className}`}
            aria-label={`${label} ${target}`}
          />
        ) : handlers[key] ? (
          <button
            key={key}
            type="button"
            className={`${styles.control} ${className}`}
            onClick={handlers[key]}
            aria-label={`${label} ${target}`}
          />
        ) : (
          <span key={key} className={`${styles.control} ${className}`} aria-hidden="true" />
        ),
      )}
    </div>
  );
}
