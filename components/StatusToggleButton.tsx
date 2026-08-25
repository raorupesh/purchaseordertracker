'use client';

import { useTransition } from 'react';
import { advanceStatus } from '../actions/updateStatus';
import { STATUS_NEXT_LABEL } from '../types';
import type { POStatus } from '../types';

interface Props {
  poNumber: string;
  currentStatus: POStatus;
}

/**
 * Client component: calls the advanceStatus server action directly.
 * useTransition gives us an isPending flag so we can show a loading state
 * without blocking the rest of the UI.
 */
export function StatusToggleButton({ poNumber, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await advanceStatus(poNumber, currentStatus);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
        bg-white border border-slate-200 text-slate-600
        hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors shadow-sm
      "
    >
      {isPending ? (
        <>
          <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
          Updating…
        </>
      ) : (
        STATUS_NEXT_LABEL[currentStatus]
      )}
    </button>
  );
}
