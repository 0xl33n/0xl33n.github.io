import { JetBrains_Mono } from 'next/font/google';

/**
 * The homepage's terminal font, self-hosted at build time by next/font.
 *
 * - No preload: the bundler shares one CSS file across pages, so a preload
 *   would be emitted on writeup pages too, where the font isn't used.
 * - Real monospace fallbacks instead of next/font's default (a resized Arial):
 *   their character widths nearly match JetBrains Mono, so text doesn't
 *   reflow when the web font swaps in (no layout shift).
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
});
