'use client';

import { useCallback, useEffect, useState } from 'react';
import { getPdfExportCooldownRemainingMs, recordPdfExport } from './pdfExport';

// Drives the "Export PDF" buttons' disabled/countdown state from the shared
// localStorage-backed rate limit in lib/pdfExport.ts.
export function useExportCooldown() {
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    const update = () => setRemainingMs(getPdfExportCooldownRemainingMs());
    update();
    const interval = setInterval(update, 1000);
    // Keeps the countdown in sync if a PDF was exported from another tab.
    window.addEventListener('storage', update);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', update);
    };
  }, []);

  const startCooldown = useCallback(() => {
    recordPdfExport();
    setRemainingMs(getPdfExportCooldownRemainingMs());
  }, []);

  return { remainingMs, startCooldown };
}
