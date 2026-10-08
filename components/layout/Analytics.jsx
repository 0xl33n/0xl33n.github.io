'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** GoatCounter: privacy-friendly page counts (no cookies, no consent banner needed). */
const GOATCOUNTER_ENDPOINT = 'https://0xl33n.goatcounter.com/count';
const GOATCOUNTER_SCRIPT = 'https://gc.zgo.at/count.js';

/**
 * Loads GoatCounter and counts every page view. count.js counts the first page
 * itself; pages reached through client-side navigation (Next.js <Link>) don't
 * reload, so they're counted here. GoatCounter ignores localhost on its own.
 * Rendered only on the deployed site (see app/layout.jsx).
 */
export default function Analytics() {
  const pathname = usePathname();
  const isFirstPage = useRef(true);

  useEffect(() => {
    if (isFirstPage.current) {
      isFirstPage.current = false; // already counted by count.js on load
      return;
    }
    window.goatcounter?.count?.({ path: window.location.pathname + window.location.search });
  }, [pathname]);

  return <script data-goatcounter={GOATCOUNTER_ENDPOINT} async src={GOATCOUNTER_SCRIPT} />;
}
