'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ImageLightbox.module.css';

/**
 * Full-screen image preview, rendered into <body> so it sits above the
 * sticky title bar. Clicking the backdrop closes it; clicking the image does not.
 * Escape is handled by ReaderShell.
 *
 * @param {{ src: string, alt: string }} image
 * @param {() => void} onClose
 */
export default function ImageLightbox({ image, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return createPortal(
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={image.alt} onClick={onClose}>
      <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={onClose}>
        Close
      </button>
      <img className={styles.image} src={image.src} alt={image.alt} onClick={(event) => event.stopPropagation()} />
      <div className={styles.caption}>{image.alt}</div>
    </div>,
    document.body,
  );
}
