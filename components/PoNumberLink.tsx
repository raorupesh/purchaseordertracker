'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition, type MouseEvent } from 'react';

interface Props {
  poNumber: string;
}

/**
 * Client component: navigates via router.push inside a transition so we get
 * an isPending flag immediately on click, instead of the link appearing to
 * do nothing until the (force-dynamic) detail page finishes rendering.
 */
export function PoNumberLink({ poNumber }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const href = `/po/${poNumber}`;

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-busy={isPending}
      className="inline-flex items-center gap-1.5 font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 text-xs"
    >
      {isPending && (
        <span className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {poNumber}
    </Link>
  );
}
