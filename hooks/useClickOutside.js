import { useEffect, useRef } from 'react';

/**
 * Calls `onClickOutside` when a pointer press lands outside every element in
 * `refs`, while `isEnabled` is true.
 *
 * @param {React.RefObject<HTMLElement>[]} refs
 * @param {(event: PointerEvent) => void} onClickOutside
 * @param {boolean} [isEnabled=true]
 */
export default function useClickOutside(refs, onClickOutside, isEnabled = true) {
  // Keep the latest refs without re-subscribing when a new array is passed each render.
  const latestRefs = useRef(refs);
  useEffect(() => {
    latestRefs.current = refs;
  });

  useEffect(() => {
    if (!isEnabled) return undefined;

    const handlePointerDown = (event) => {
      const isInside = latestRefs.current.some((ref) => ref.current?.contains(event.target));
      if (!isInside) onClickOutside(event);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [onClickOutside, isEnabled]);
}
