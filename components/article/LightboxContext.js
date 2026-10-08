'use client';

import { createContext, useContext } from 'react';

/** Provides `openImage({ src, alt })` to article images; set up by ReaderShell. */
export const LightboxContext = createContext(null);

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) throw new Error('useLightbox must be used inside <ReaderShell>.');
  return context;
}
