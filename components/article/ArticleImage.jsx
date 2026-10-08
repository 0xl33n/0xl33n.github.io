'use client';

import { useLightbox } from './LightboxContext';
import styles from './ArticleContent.module.css';

/**
 * Article image that opens in the lightbox. Wrapped in a button so it is
 * reachable and operable from the keyboard.
 */
export default function ArticleImage({ src, srcSet, sizes, alt, width, height, loading, decoding }) {
  const { openImage } = useLightbox();
  return (
    <button
      type="button"
      className={styles.imageButton}
      onClick={() => openImage({ src, alt })}
      aria-label={`Enlarge image: ${alt}`}
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
      />
    </button>
  );
}
