'use server';

import { revalidatePath } from 'next/cache';
import { updateOrderStatus } from '../lib/order';
import { getCurrentUser } from '../lib/auth';
import { STATUS_CYCLE } from '../types';
import type { POStatus } from '../types';

/**
 * Server action: advances a PO's status one step around the cycle
 * pending → confirmed → shipped → received → pending
 *
 * Called directly from StatusToggleButton (client component) via useTransition.
 * Records who made the change (the logged-in username) and when, then
 * revalidatePath() tells Next.js to re-render the list page and this PO's
 * detail page on the next request.
 */
export async function advanceStatus(
  poNumber: string,
  currentStatus: POStatus
): Promise<void> {
  const nextStatus = STATUS_CYCLE[currentStatus];
  const user = await getCurrentUser();
  await updateOrderStatus(poNumber, nextStatus, user?.username ?? 'unknown');
  revalidatePath('/');
  revalidatePath(`/po/${poNumber}`);
}
