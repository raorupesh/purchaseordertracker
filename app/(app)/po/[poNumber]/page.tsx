// Dynamic route: /po/[poNumber]
// params is a Promise in Next.js 15 — must be awaited.
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOrderByPoNumber } from '@/lib/order';
import { StatusBadge } from '@/components/StatusBadge';
import { STATUS_LABELS } from '@/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ poNumber: string }>;
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function currency(n: number) {
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

export default async function PODetailPage({ params }: Props) {
  const { poNumber } = await params;
  const po = await getOrderByPoNumber(poNumber);

  if (!po) notFound();

  const totalQty = po.lineItems.reduce((s, i) => s + i.extQty, 0);
  const totalCartons = po.lineItems.reduce((s, i) => s + i.ctns, 0);

  return (
    <>
      {/* PO sub-header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            >
              ← All Orders
            </Link>
            <span className="text-slate-200">/</span>
            <span className="font-mono font-semibold text-slate-900 text-sm">
              {po.poNumber}
            </span>
            <StatusBadge status={po.status} />
          </div>
          <div className="flex items-center gap-2" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* PO header fields */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Buyer',         value: po.buyer },
            { label: 'Ship Terms',    value: po.shipTerms },
            { label: 'Ship Date',     value: po.shipDate },
            { label: 'Ref Master PO', value: po.refMasterPO },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-lg border border-slate-200 px-4 py-3"
            >
              <div className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">
                {label}
              </div>
              <div className="text-sm text-slate-800 font-mono">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Vendor',  value: po.vendor  },
            { label: 'Ship To', value: po.shipTo  },
            { label: 'Bill To', value: po.billTo  },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-lg border border-slate-200 px-4 py-3"
            >
              <div className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">
                {label}
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Line Items',    value: po.lineItems.length, mono: false },
            { label: 'Total Cartons', value: totalCartons.toLocaleString(), mono: true },
            { label: 'Total Units',   value: totalQty.toLocaleString(), mono: true },
            { label: 'Total Cost',    value: currency(po.totalCost), mono: true },
          ].map(({ label, value, mono }) => (
            <div
              key={label}
              className="bg-white rounded-lg border border-slate-200 px-4 py-3 text-center"
            >
              <div className={`text-2xl font-semibold text-slate-900 leading-none ${mono ? 'font-mono' : ''}`}>
                {value}
              </div>
              <div className="text-xs text-slate-400 mt-2 uppercase tracking-wide">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Line items table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Line Items</h2>
            <span className="text-xs text-slate-400 font-mono">
              {po.lineItems.length} SKUs
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  {[
                    { label: 'Dept',        align: 'left'  },
                    { label: 'SKU',         align: 'left'  },
                    { label: 'UPC',         align: 'left'  },
                    { label: 'Part #',      align: 'left'  },
                    { label: 'Description', align: 'left'  },
                    { label: 'Retail',      align: 'right' },
                    { label: 'Cost',        align: 'right' },
                    { label: 'CTNS',        align: 'right' },
                    { label: 'CSPK',        align: 'right' },
                    { label: 'Ext Qty',     align: 'right' },
                    { label: 'Ext Cost',    align: 'right' },
                  ].map(({ label, align }) => (
                    <th
                      key={label}
                      className={`px-3 py-2.5 font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap text-${align}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {po.lineItems.map((item) => (
                  <tr key={item.sku} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 py-2.5 text-slate-500">{item.dept}</td>
                    <td className="px-3 py-2.5 font-mono font-medium text-slate-800">
                      {item.sku}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-400">{item.upc}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-500">
                      {item.vendorPartNum}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 max-w-[220px]">
                      {item.description}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">
                      ${fmt(item.retail)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">
                      ${fmt(item.cost, 3)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">
                      {item.ctns}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">
                      {item.cspk}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-800 font-medium">
                      {item.extQty.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-800 font-medium">
                      ${fmt(item.extCost, 3)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/70">
                  <td colSpan={9} className="px-3 py-2.5 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Total
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-900">
                    {totalQty.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-900">
                    {currency(po.totalCost)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Status history */}
        {po.statusHistory.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Status History</h2>
            </div>
            <ul className="divide-y divide-slate-50">
              {[...po.statusHistory].reverse().map((entry, i) => (
                <li
                  key={i}
                  className="px-5 py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <span className="text-slate-700">
                    {STATUS_LABELS[entry.fromStatus]} → {STATUS_LABELS[entry.toStatus]}
                  </span>
                  <span className="text-slate-400 font-mono whitespace-nowrap">
                    {formatDateTime(entry.changedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
