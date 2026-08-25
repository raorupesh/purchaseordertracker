// Automatically shown by Next.js while PODetailPage is
// server-rendering, so a click on a PO number gets instant feedback instead
// of appearing to do nothing.
export default function LoadingPODetail() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
      <span className="w-6 h-6 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
      <span className="text-xs">Loading purchase order…</span>
    </div>
  );
}
