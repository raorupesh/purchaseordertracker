'use client';

import { useState } from 'react';
import type { OrderSummary } from '../types';
import { STATUS_LABELS } from '../types';
import { useExportCooldown } from '../lib/useExportCooldown';

interface Props {
  orders: OrderSummary[];
}

function currency(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// Date only — no username — this is a PDF handed off outside the app, not a
// UI element where "by <user>" belongs.
function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ExportOrdersPdfButton({ orders }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { remainingMs, startCooldown } = useExportCooldown();
  const onCooldown = remainingMs > 0;

  async function handleExport() {
    if (isGenerating || onCooldown) return;
    setIsGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text('Purchase Orders — NHF Supply Chain', 14, 16);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Generated ${new Date().toLocaleString('en-US')}`, 14, 22);

      autoTable(doc, {
        startY: 28,
        head: [['PO Number', 'Brand', 'Vendor', 'Ship Date', 'Items', 'Total Cost', 'Status', 'Last Updated']],
        body: orders.map((o) => [
          o.poNumber,
          o.brand,
          o.vendor,
          o.shipDate,
          String(o.itemCount),
          currency(o.totalCost),
          STATUS_LABELS[o.status],
          formatDate(o.lastUpdatedAt),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 41, 59] },
      });

      doc.save('purchase-orders.pdf');
      startCooldown();
    } finally {
      setIsGenerating(false);
    }
  }

  const label = isGenerating
    ? 'Exporting…'
    : onCooldown
      ? `Wait ${Math.ceil(remainingMs / 1000)}s`
      : 'Export PDF';

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating || onCooldown}
      title={onCooldown ? 'PDF exports are limited to one per minute' : undefined}
      className="
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
        bg-white border border-slate-200 text-slate-600
        hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors shadow-sm
        focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-1
      "
    >
      {isGenerating && (
        <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
      )}
      {label}
    </button>
  );
}
