import { useEffect } from 'react';

/**
 * Calls `onKeyPress` whenever `key` is pressed, while `isEnabled` is true.
 * Pass a stable callback (e.g. from useCallback) to avoid re-subscribing on every render.
 */
export default function useKeyPress(key, onKeyPress, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === key) onKeyPress(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, onKeyPress, isEnabled]);
}
