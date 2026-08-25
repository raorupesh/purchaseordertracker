import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { PurchaseOrder, POStatus } from '../types';

// NOTE: Uses the local filesystem works perfectly in dev (npm run dev).
// For a production deployment you'd swap this out for a real database.
const DATA_PATH = path.join(process.cwd(), 'data', 'purchase-orders.json');

export async function getAllOrders(): Promise<PurchaseOrder[]> {
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as PurchaseOrder[];
}

export async function getOrderByPoNumber(
  poNumber: string
): Promise<PurchaseOrder | undefined> {
  const orders = await getAllOrders();
  return orders.find((o) => o.poNumber === poNumber);
}

export async function updateOrderStatus(
  poNumber: string,
  newStatus: POStatus,
  changedBy: string
): Promise<void> {
  const orders = await getAllOrders();
  const idx = orders.findIndex((o) => o.poNumber === poNumber);
  if (idx === -1) throw new Error(`PO ${poNumber} not found`);

  const order = orders[idx];
  order.statusHistory = [
    ...order.statusHistory,
    {
      fromStatus: order.status,
      toStatus: newStatus,
      changedBy,
      changedAt: new Date().toISOString(),
    },
  ];
  order.status = newStatus;

  await writeFile(DATA_PATH, JSON.stringify(orders, null, 2), 'utf-8');
}
