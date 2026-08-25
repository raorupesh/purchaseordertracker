'use client';

import { useState } from 'react';
import type { PurchaseOrder } from '../types';
import { STATUS_LABELS } from '../types';
import { useExportCooldown } from '../lib/useExportCooldown';

interface Props {
  po: PurchaseOrder;
}

function currency(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function ExportPoDetailPdfButton({ po }: Props) {
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
      doc.text(`Purchase Order ${po.poNumber}`, 14, 16);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Status: ${STATUS_LABELS[po.status]}`, 14, 22);

      autoTable(doc, {
        startY: 28,
        theme: 'plain',
        styles: { fontSize: 8, textColor: [30, 41, 59] },
        body: [
          ['Buyer', po.buyer, 'Ship Terms', po.shipTerms],
          ['Ship Date', po.shipDate, 'Ref Master PO', po.refMasterPO],
          ['Vendor', po.vendor, 'Ship To', po.shipTo],
          ['Bill To', po.billTo, 'Total Cost', currency(po.totalCost)],
        ],
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 30 },
          2: { fontStyle: 'bold', cellWidth: 30 },
        },
      });

      const totalQty = po.lineItems.reduce((s, i) => s + i.extQty, 0);

      autoTable(doc, {
        startY: (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6,
        head: [['Dept', 'SKU', 'UPC', 'Part #', 'Description', 'Retail', 'Cost', 'CTNS', 'CSPK', 'Ext Qty', 'Ext Cost']],
        body: po.lineItems.map((item) => [
          item.dept,
          item.sku,
          item.upc,
          item.vendorPartNum,
          item.description,
          `$${fmt(item.retail)}`,
          `$${fmt(item.cost, 3)}`,
          String(item.ctns),
          String(item.cspk),
          item.extQty.toLocaleString(),
          `$${fmt(item.extCost, 3)}`,
        ]),
        foot: [[
          '', '', '', '', '', '', '', '', 'Total',
          totalQty.toLocaleString(),
          currency(po.totalCost),
        ]],
        styles: { fontSize: 7 },
        headStyles: { fillColor: [30, 41, 59] },
        footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      });

      doc.save(`${po.poNumber}.pdf`);
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
