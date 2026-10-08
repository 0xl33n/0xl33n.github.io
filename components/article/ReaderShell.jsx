'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import WindowControls from '@/components/layout/WindowControls';
import { classNames } from '@/lib/classNames';
import useKeyPress from '@/hooks/useKeyPress';
import useReaderPreferences from '@/hooks/useReaderPreferences';
import ImageLightbox from './ImageLightbox';
import { LightboxContext } from './LightboxContext';
import ReaderSettings from './ReaderSettings';
import styles from './ReaderShell.module.css';
import ThemeTip from './ThemeTip';

/**
 * Interactive frame around server-rendered reading pages (the writeups list
 * and each writeup): macOS-style title bar with reading settings, a scroll
 * progress bar, and the image lightbox.
 *
 * @param {string} [fileName] - Current writeup file, shown at the end of the title-bar path.
 * @param {string} closeHref - Where "Close" and Escape go.
 * @param {boolean} [showProgress=true] - Reading progress bar (pointless on short pages).
 * @param {React.ReactNode} children - The page content.
 */
export default function ReaderShell({ fileName, closeHref, showProgress = true, children }) {
  const router = useRouter();
  const preferences = useReaderPreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const lightboxTriggerRef = useRef(null);

  const close = useCallback(() => router.push(closeHref), [router, closeHref]);

  const openImage = useCallback((image) => {
    lightboxTriggerRef.current = document.activeElement;
    setLightboxImage(image);
  }, []);

  const closeImage = useCallback(() => {
    setLightboxImage(null);
    lightboxTriggerRef.current?.focus?.();
  }, []);

  // Escape closes the lightbox first, then leaves the page. (The settings
  // menu handles its own Escape and stops it from reaching this listener.)
  const handleEscape = useCallback(() => {
    if (lightboxImage) closeImage();
    else close();
  }, [lightboxImage, closeImage, close]);
  useKeyPress('Escape', handleEscape);

  const lightboxValue = useMemo(() => ({ openImage }), [openImage]);

  return (
    <LightboxContext.Provider value={lightboxValue}>
      <div className={styles.reader}>
        <header className={styles.titleBar}>
          {/* Close is a real link, so it works even before JavaScript has loaded. */}
          <WindowControls target="page" closeHref={closeHref} />
          {/* Terminal-style path where each segment is a link: ~ = home, writeups = list. */}
          <nav className={styles.title} aria-label="Breadcrumb">
            <b>neel</b>@portfolio:{' '}
            <Link href="/" className={styles.pathLink}>
              ~
            </Link>
            /
            <Link href="/writeups/" className={styles.pathLink} aria-current={fileName ? undefined : 'page'}>
              writeups
            </Link>
            {fileName && (
              <>
                /<span aria-current="page">{fileName}</span>
              </>
            )}
          </nav>
          <div className={styles.actions}>
            {/* On a writeup, the first button goes back to the list; on the list itself, home. */}
            {fileName && (
              <Link className={styles.toolbarButton} href="/writeups/">
                <span className={styles.backArrow} aria-hidden="true">
                  ←{' '}
                </span>
                Writeups
              </Link>
            )}
            <Link className={styles.toolbarButton} href="/">
              {!fileName && (
                <span className={styles.backArrow} aria-hidden="true">
                  ←{' '}
                </span>
              )}
              Home
            </Link>
            <ReaderSettings isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} preferences={preferences} />
            {/* On a writeup, Close goes where "Writeups" does, so phones drop it to make room. */}
            <Link className={classNames(styles.toolbarButton, fileName && styles.redundantOnPhones)} href={closeHref}>
              Close
            </Link>
          </div>

          {/* Fills as the page scrolls (CSS scroll-driven animation; hidden where unsupported). */}
          {showProgress && <div className={styles.progressBar} aria-hidden="true" />}
        </header>

        {/* First-visit tip about the Theme button, in the page flow so it covers nothing. */}
        <ThemeTip />

        {children}
      </div>

      {lightboxImage && <ImageLightbox image={lightboxImage} onClose={closeImage} />}
    </LightboxContext.Provider>
  );
}
