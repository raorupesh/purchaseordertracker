# Purchase Order Tracker

A purchase-order tracking app: Sign In, browse purchase orders, get into depth of one PO order using its unique Number, and advance its status. Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4.

## Running it

```bash
npm install
cp .env.example .env.local   # fill in SESSION_SECRET (any random string)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll land on `/login` sign in with:

- **Username:** `jmartinez`
- **Password:** `NHFDemo2026!`

(This account is seeded in `data/users.json`, committed for convenience since this is a
take-home demo, not a real credential.)

## What's implemented

- **Data + rendering** : `app/(app)/page.tsx` is a server component that reads
  `data/purchase-orders.json` and renders the full order list, including per-status counts and a total value summary.
- **Server action**: `actions/updateStatus.ts` (`advanceStatus`) is a `'use server'`
  action wired to the "Mark Confirmed / Shipped / Received" button on each row. It cycles
  a PO's status (`pending → confirmed → shipped → received → pending`), appends an entry
  to that PO's status history (who changed it and when), persists the change back to the
  JSON file, and calls `revalidatePath` on both the list and that PO's detail page so the
  UI reflects the change immediately.
- **Dynamic route**: `app/(app)/po/[poNumber]/page.tsx` shows the full detail view for
  one PO (buyer/vendor/ship info, line items, totals, status history), or a 404 if the PO
  number doesn't exist.

## Assumptions

- **Storage:** "Database" is two JSON files under `data/`, read/written directly via
  `fs`. Fine for a take-home; a real app would use an actual database, since concurrent
  writes here aren't safe.
- **Single demo user:** there's one seeded account rather than a signup flow the brief
  didn't ask for user management, and it wasn't the point of the exercise.
