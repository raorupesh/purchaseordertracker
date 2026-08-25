export function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
        <span>NHF Supply Chain · Purchase Order Tracker</span>
        <span className="font-mono">&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
