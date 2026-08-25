// Client-side PDF export rate limit, shared across every export button in the
// app (list page + PO detail pages): at most one PDF download per minute.
// Backed by localStorage so the limit holds across pages/tabs, not just one
// component instance.
const STORAGE_KEY = 'po-tracker:last-pdf-export-at';
export const PDF_EXPORT_COOLDOWN_MS = 60_000;

export function getPdfExportCooldownRemainingMs(): number {
  if (typeof window === 'undefined') return 0;
  const lastExportAt = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
  const remaining = PDF_EXPORT_COOLDOWN_MS - (Date.now() - lastExportAt);
  return remaining > 0 ? remaining : 0;
}

export function recordPdfExport(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
}
