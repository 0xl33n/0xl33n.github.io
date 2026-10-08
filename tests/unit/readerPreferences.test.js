import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PREFERENCES,
  TEXT_SIZES,
  THEME_OPTIONS,
  createPreferencesBootstrapScript,
  parsePreferences,
} from '@/lib/readerPreferences';

describe('parsePreferences', () => {
  it('defaults to the terminal theme and the homepage (mono) font', () => {
    expect(DEFAULT_PREFERENCES.theme).toBe('terminal');
    expect(DEFAULT_PREFERENCES.fontFamily).toBe('mono');
    expect(THEME_OPTIONS).toEqual(['terminal', 'light', 'dark']);
  });

  it('returns defaults for missing, empty or corrupt storage', () => {
    expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('')).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('{not json')).toEqual(DEFAULT_PREFERENCES);
  });

  it('keeps valid values and replaces invalid ones individually', () => {
    expect(parsePreferences(JSON.stringify({ theme: 'dark', fontFamily: 'comic', textSizeIndex: 99 }))).toEqual({
      ...DEFAULT_PREFERENCES,
      theme: 'dark',
    });
  });

  it('ignores values from older versions (e.g. "auto") and falls back to terminal', () => {
    expect(parsePreferences(JSON.stringify({ theme: 'auto' })).theme).toBe('terminal');
    expect(parsePreferences(JSON.stringify({ themePreference: 'light' })).theme).toBe('terminal');
  });
});

describe('createPreferencesBootstrapScript', () => {
  /** Runs the inline script against a fake browser and returns what it set on <html>. */
  function runBootstrap({ stored, pathname = '/portfolio/writeups/x/' }) {
    const dataset = {};
    const styles = {};
    runInNewContext(createPreferencesBootstrapScript('/portfolio'), {
      location: { pathname },
      localStorage: { getItem: () => stored },
      document: { documentElement: { dataset, style: { setProperty: (name, value) => (styles[name] = value) } } },
    });
    return { dataset, styles };
  }

  it('applies saved preferences before React loads', () => {
    const { dataset, styles } = runBootstrap({
      stored: JSON.stringify({ theme: 'light', fontFamily: 'serif', textSizeIndex: 6 }),
    });
    expect(dataset).toEqual({ readerTheme: 'light', readerFont: 'serif' });
    expect(styles['--reader-text-size']).toBe(`${TEXT_SIZES[6]}px`);
  });

  it('uses the terminal theme and default size with nothing stored', () => {
    const { dataset, styles } = runBootstrap({ stored: null });
    expect(dataset).toEqual({ readerTheme: 'terminal', readerFont: 'mono' });
    expect(styles['--reader-text-size']).toBe('18px');
  });

  it('does nothing outside /writeups pages, so the homepage keeps its own theme', () => {
    const { dataset, styles } = runBootstrap({ stored: JSON.stringify({ theme: 'light' }), pathname: '/portfolio/' });
    expect(dataset).toEqual({});
    expect(styles).toEqual({});
  });
});
