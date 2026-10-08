'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import styles from './CustomCursor.module.css';

/**
 * Themed, animated mouse cursor: a dot that tracks the pointer exactly and a
 * ring that trails it smoothly. Colours and shape come from CSS variables set
 * per theme in app/globals.css, so it follows reader theme changes instantly.
 *
 * Only enabled for real mice (hover + fine pointer) and when the reader hasn't
 * asked for reduced motion; otherwise the system cursor is left alone.
 */
const ENABLE_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** How quickly the ring catches up with the pointer each frame (0–1). */
const RING_EASING = 0.2;

/** Elements that get the enlarged "interactive" ring. */
const INTERACTIVE = 'a, button, [role="button"], summary, label, select, [tabindex]:not([tabindex="-1"])';
/** Text fields keep the system I-beam; the custom cursor hides over them. */
const TEXT_FIELDS = 'input:not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

function subscribe(onChange) {
  const query = window.matchMedia(ENABLE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
const isSupported = () => window.matchMedia(ENABLE_QUERY).matches;

/** Which look the ring should have for the element under the pointer. */
function stateFor(target) {
  if (!(target instanceof Element)) return 'default';
  if (target.closest(TEXT_FIELDS)) return 'text';
  if (target.closest('[role="dialog"][aria-modal="true"]') && !target.closest('button')) return 'close'; // lightbox backdrop
  if (target.closest('button[aria-label^="Enlarge image"]')) return 'zoom';
  if (target.closest(INTERACTIVE)) return 'interactive';
  return 'default';
}

export default function CustomCursor() {
  // Server render and hydration assume "off"; the cursor appears once supported.
  const isEnabled = useSyncExternalStore(subscribe, isSupported, () => false);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!isEnabled) return undefined;
    const root = document.documentElement;
    const cursor = cursorRef.current;
    const pointer = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let frame = null;

    root.classList.add('has-custom-cursor');

    // Ease the ring toward the pointer; stop the loop once it has caught up.
    const animate = () => {
      ring.x += (pointer.x - ring.x) * RING_EASING;
      ring.y += (pointer.y - ring.y) * RING_EASING;
      ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      const isSettled = Math.abs(pointer.x - ring.x) < 0.1 && Math.abs(pointer.y - ring.y) < 0.1;
      frame = isSettled ? null : requestAnimationFrame(animate);
    };

    const handleMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const isFirstMove = cursor.dataset.visible !== 'true';
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (isFirstMove) {
        // Appear in place instead of flying in from the corner.
        ring.x = pointer.x;
        ring.y = pointer.y;
        cursor.dataset.visible = 'true';
      }
      dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      if (frame === null) frame = requestAnimationFrame(animate);
    };

    const handleOver = (event) => {
      cursor.dataset.state = stateFor(event.target);
    };
    const handleDown = () => {
      cursor.dataset.pressed = 'true';
    };
    const handleUp = () => {
      cursor.dataset.pressed = 'false';
    };
    // relatedTarget is null when the pointer leaves the window.
    const handleOut = (event) => {
      if (!event.relatedTarget) cursor.dataset.visible = 'false';
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerover', handleOver, { passive: true });
    document.addEventListener('pointerdown', handleDown, { passive: true });
    document.addEventListener('pointerup', handleUp, { passive: true });
    document.addEventListener('pointerout', handleOut, { passive: true });

    return () => {
      root.classList.remove('has-custom-cursor');
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerover', handleOver);
      document.removeEventListener('pointerdown', handleDown);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointerout', handleOut);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div ref={cursorRef} className={styles.cursor} data-visible="false" data-state="default" aria-hidden="true">
      <div ref={ringRef} className={styles.ring}>
        <span className={styles.ringShape}>
          <span className={styles.label} />
        </span>
      </div>
      <div ref={dotRef} className={styles.dot}>
        <span className={styles.dotShape} />
      </div>
    </div>
  );
}
