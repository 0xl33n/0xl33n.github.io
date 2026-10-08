import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_PREFERENCES,
  STORAGE_KEY,
  TEXT_SIZES,
  applyPreferences,
  clearPreferences,
  parsePreferences,
} from '@/lib/readerPreferences';

function readStoredPreferences() {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    return parsePreferences(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage unavailable (private mode, blocked cookies).
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Reader display preferences (theme, font, text size), persisted in
 * localStorage and mirrored onto <html> (see lib/readerPreferences.js).
 */
export default function useReaderPreferences() {
  const [preferences, setPreferences] = useState(readStoredPreferences);
  const { theme, fontFamily, textSizeIndex } = preferences;
  const textSize = TEXT_SIZES[textSizeIndex];

  useEffect(() => {
    applyPreferences(document.documentElement, { theme, fontFamily, textSize });
  }, [theme, fontFamily, textSize]);

  // Leave the homepage untouched after navigating away from a writeup.
  useEffect(() => () => clearPreferences(document.documentElement), []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Not persisting is fine.
    }
  }, [preferences]);

  const setTheme = useCallback((value) => setPreferences((current) => ({ ...current, theme: value })), []);
  const setFontFamily = useCallback((value) => setPreferences((current) => ({ ...current, fontFamily: value })), []);

  const changeTextSize = useCallback((step) => {
    setPreferences((current) => ({
      ...current,
      textSizeIndex: Math.min(Math.max(current.textSizeIndex + step, 0), TEXT_SIZES.length - 1),
    }));
  }, []);
  const increaseTextSize = useCallback(() => changeTextSize(1), [changeTextSize]);
  const decreaseTextSize = useCallback(() => changeTextSize(-1), [changeTextSize]);

  return {
    theme,
    fontFamily,
    textSize,
    canIncreaseTextSize: textSizeIndex < TEXT_SIZES.length - 1,
    canDecreaseTextSize: textSizeIndex > 0,
    setTheme,
    setFontFamily,
    increaseTextSize,
    decreaseTextSize,
  };
}
