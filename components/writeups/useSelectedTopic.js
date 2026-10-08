'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * The topic picked on the /writeups/ page lives in the URL hash
 * (/writeups/#heap-exploitation), so it can be linked to (the article kicker
 * does) and survives reloads and the back button. No hash means all topics.
 */

const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener('hashchange', listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('hashchange', listener);
    window.removeEventListener('popstate', listener);
  };
}

const getHash = () => decodeURIComponent(window.location.hash.slice(1));
// The static HTML shows every topic; the hash is applied after hydration.
const getServerHash = () => '';

/**
 * @param {string[]} topicIds - Valid topic ids; any other hash (e.g. #main from the skip link) means all topics.
 * @returns {[string | null, (id: string | null) => void]} The selected topic id (null for all) and a setter.
 */
export function useSelectedTopic(topicIds) {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const selected = topicIds.includes(hash) ? hash : null;

  const select = useCallback((id) => {
    const url = id ? `#${encodeURIComponent(id)}` : window.location.pathname + window.location.search;
    // pushState (not location.hash) so the browser doesn't jump to the topic's heading.
    window.history.pushState(window.history.state, '', url);
    listeners.forEach((listener) => listener());
  }, []);

  return [selected, select];
}
