/**
 * Reader display preferences (theme, font, text size): defaults, validation,
 * and how they are applied to the page.
 *
 * Preferences are applied as attributes on <html>:
 *   data-reader-theme="terminal" | "light" | "dark"
 *   data-reader-font="mono" | "sans" | "serif"
 *   style="--reader-text-size: 18px"
 * so the inline script below can set them before first paint (no theme flash)
 * and React only has to keep them in sync afterwards.
 */

export const STORAGE_KEY = 'reader-preferences';

/** Available body text sizes in px. */
export const TEXT_SIZES = [15, 16, 17, 18, 20, 22, 24];

/** "terminal" matches the homepage and is the default. */
export const THEME_OPTIONS = ['terminal', 'light', 'dark'];
/** "mono" is the homepage's JetBrains Mono and the default. */
export const FONT_OPTIONS = ['mono', 'sans', 'serif'];

export const DEFAULT_PREFERENCES = {
  theme: 'terminal',
  fontFamily: 'mono',
  textSizeIndex: TEXT_SIZES.indexOf(18),
};

/** Validates stored JSON, falling back to defaults for anything missing or invalid. */
export function parsePreferences(json) {
  let saved = {};
  try {
    saved = JSON.parse(json) ?? {};
  } catch {
    // Corrupt value: use defaults.
  }
  return {
    theme: THEME_OPTIONS.includes(saved.theme) ? saved.theme : DEFAULT_PREFERENCES.theme,
    fontFamily: FONT_OPTIONS.includes(saved.fontFamily) ? saved.fontFamily : DEFAULT_PREFERENCES.fontFamily,
    textSizeIndex:
      Number.isInteger(saved.textSizeIndex) && TEXT_SIZES[saved.textSizeIndex]
        ? saved.textSizeIndex
        : DEFAULT_PREFERENCES.textSizeIndex,
  };
}

/** Writes preferences onto <html>. */
export function applyPreferences(root, { theme, fontFamily, textSize }) {
  root.dataset.readerTheme = theme;
  root.dataset.readerFont = fontFamily;
  root.style.setProperty('--reader-text-size', `${textSize}px`);
}

/** Removes reader attributes, e.g. when navigating from a writeup back to the homepage. */
export function clearPreferences(root) {
  delete root.dataset.readerTheme;
  delete root.dataset.readerFont;
  root.style.removeProperty('--reader-text-size');
}

/**
 * Inline script rendered in the root layout's <head>, so it runs before the
 * page paints (no theme flash). It only acts on /writeups pages; client-side
 * navigation is handled by useReaderPreferences. Must stay dependency free:
 * it runs before React loads. Mirrors parsePreferences/applyPreferences.
 *
 * @param {string} basePath - e.g. "/portfolio" or "".
 */
export const createPreferencesBootstrapScript = (basePath) => `(function () {
  try {
    if (location.pathname.indexOf(${JSON.stringify(`${basePath}/writeups/`)}) !== 0) return;
    var sizes = ${JSON.stringify(TEXT_SIZES)};
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})) || {}; } catch (e) {}
    var theme = ${JSON.stringify(THEME_OPTIONS)}.indexOf(saved.theme) >= 0 ? saved.theme : ${JSON.stringify(DEFAULT_PREFERENCES.theme)};
    var font = ${JSON.stringify(FONT_OPTIONS)}.indexOf(saved.fontFamily) >= 0 ? saved.fontFamily : ${JSON.stringify(DEFAULT_PREFERENCES.fontFamily)};
    var size = sizes[saved.textSizeIndex] || ${TEXT_SIZES[DEFAULT_PREFERENCES.textSizeIndex]};
    var root = document.documentElement;
    root.dataset.readerTheme = theme;
    root.dataset.readerFont = font;
    root.style.setProperty('--reader-text-size', size + 'px');
  } catch (e) {}
})();`;
