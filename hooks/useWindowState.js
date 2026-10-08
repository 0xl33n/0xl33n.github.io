import { useCallback, useState } from 'react';

/**
 * Minimize / maximize toggles shared by the fake terminal-style windows.
 */
export default function useWindowState() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMinimized = useCallback(() => setIsMinimized((value) => !value), []);
  const toggleMaximized = useCallback(() => setIsMaximized((value) => !value), []);
  const resetWindow = useCallback(() => {
    setIsMinimized(false);
    setIsMaximized(false);
  }, []);

  return { isMinimized, isMaximized, toggleMinimized, toggleMaximized, resetWindow };
}
