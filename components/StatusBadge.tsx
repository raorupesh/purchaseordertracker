import type { POStatus } from '../types';
import { STATUS_LABELS } from '../types';

// Shared status color system — the box (background/border/text) carries the
// color. Reused by StatusBadge (table pill) and the list page's summary
// strip cards.
export const STATUS_BOX_STYLES: Record<POStatus, string> = {
  pending:   'bg-amber-50   text-amber-700   border-amber-200',
  confirmed: 'bg-blue-50    text-blue-700    border-blue-200',
  shipped:   'bg-violet-50  text-violet-700  border-violet-200',
  received:  'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function StatusBadge({ status }: { status: POStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_BOX_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
