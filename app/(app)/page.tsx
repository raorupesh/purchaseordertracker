// Server component: Data is fetched on the server, no client JS required for the list.
// The StatusToggleButton is a client island nested inside this server tree.
// Auth is enforced by middleware.ts, which runs before this page renders.
import { getAllOrders } from '@/lib/order';
import { StatusBadge, STATUS_BOX_STYLES } from '@/components/StatusBadge';
import { StatusToggleButton } from '@/components/StatusToggleButton';
import { PoNumberLink } from '@/components/PoNumberLink';
import { STATUS_LABELS, type POStatus } from '@/types';

// Opt out of static generation so the list always reflects the current JSON state.
export const dynamic = 'force-dynamic';

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default async function HomePage() {
  const orders = await getAllOrders();

  const totalValue = orders.reduce((s, o) => s + o.totalCost, 0);
  const byStatus = {
    pending:   orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    shipped:   orders.filter((o) => o.status === 'shipped').length,
    received:  orders.filter((o) => o.status === 'received').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          [
            { status: 'pending',   count: byStatus.pending   },
            { status: 'confirmed', count: byStatus.confirmed },
            { status: 'shipped',   count: byStatus.shipped   },
            { status: 'received',  count: byStatus.received  },
          ] as const satisfies readonly { status: POStatus; count: number }[]
        ).map(({ status, count }) => (
          <div
            key={status}
            className={`rounded-lg border px-4 py-3 ${STATUS_BOX_STYLES[status]}`}
          >
            <div className="text-xl font-semibold font-mono leading-none">
              {count}
            </div>
            <div className="text-xs mt-1 opacity-80">{STATUS_LABELS[status]}</div>
          </div>
        ))}
      </div>

      {/* Total value */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">
          <span className="font-bold text-slate-700">{formatCurrency(totalValue)}</span> total value
        </span>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {['PO Number', 'Brand', 'Vendor', 'Ship Date', 'Items', 'Total Cost', 'Status', 'Last Updated', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((po) => {
                const lastChange = po.statusHistory[po.statusHistory.length - 1];
                return (
                  <tr
                    key={po.poNumber}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <PoNumberLink poNumber={po.poNumber} />
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium text-xs">
                      {po.brand}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[160px] truncate">
                      {po.vendor.split('\n')[0]}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {po.shipDate}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 text-center">
                      {po.lineItems.length}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-800 text-right">
                      {formatCurrency(po.totalCost)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={po.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {lastChange ? (
                        formatDateTime(lastChange.changedAt)
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusToggleButton
                        poNumber={po.poNumber}
                        currentStatus={po.status}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
