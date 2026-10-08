import styles from './CrtOverlay.module.css';

/** Decorative CRT scanlines and vignette drawn above the whole page. */
export default function CrtOverlay() {
  return (
    <>
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
    </>
  );
}
