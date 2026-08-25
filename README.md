# Purchase Order Tracker

A purchase-order tracking app: Sign In, browse purchase orders, get into depth of one PO order using its unique Number, and advance its status. Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in SESSION_SECRET — see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). 

Note if you have any other process running you will be prompted different port rather than 3000.

You'll land on `/login` sign in with:

- **Username:** `jmartinez`
- **Password:** `NHFDemo2026!`

(This account is seeded in `data/users.json`, committed for convenience since this is a
take-home demo, not a real credential.)

## Environment variables

The app needs one variable, defined in `.env.local` (a file you create yourself — it's
gitignored and never committed, since it holds a real secret):

| Variable         | Required | Purpose |
|-------------------|----------|---------|
| `SESSION_SECRET`  | Yes      | Signs and verifies the login session cookie (a JWT, HS256 via [`jose`](https://github.com/panva/jose) see `lib/session.ts`). The app throws on startup if it's missing. |

`.env.example` is the checked-in template copy it to `.env.local` and fill in a value.
It contains no secret itself, only the variable name, so it's safe to commit.

**Generating a value for `SESSION_SECRET`**  any sufficiently random string works; a
32-byte hex string is a good default. Pick whichever command matches your shell:

```bash
# Cross-platform (Node is already required to run this project):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# macOS / Linux / WSL / Git Bash:
openssl rand -hex 32

# Windows PowerShell:
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
```

Paste the output as the value of `SESSION_SECRET` in `.env.local`. Notes:

- Changing the secret invalidates every existing session cookie (everyone gets logged
  out) that's expected, not a bug.
- Never commit `.env.local` or paste a real secret into `.env.example`, a PR, or a chat.
- In production, cookies are additionally marked `secure` (HTTPS-only) whenever
  `NODE_ENV=production` — see `actions/auth.ts`.

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
- **PDF export**: an "Export PDF" button on the order list (table of all orders) and
  another on each PO's detail page (full PO + line items), both client-side via `jspdf`
  / `jspdf-autotable` (`components/ExportOrdersPdfButton.tsx`,
  `components/ExportPoDetailPdfButton.tsx`). Rate-limited to one export per minute per
  browser (`lib/pdfExport.ts`) to avoid accidental repeat-click spam.

## Assumptions

- **Storage:** "Database" is two JSON files under `data/`, read/written directly via
  `fs`. Fine for a take-home; a real app would use an actual database, since concurrent
  writes here aren't safe.
- **Single demo user:** there's one seeded account rather than a signup flow the brief
  didn't ask for user management, and it wasn't the point of the exercise.
- **Authentication:** Reason for authentication is that I would not like any application to be unsafe under any circumstances, so in case if I develop any application in future security will remain my priority.
- **Export Data:** Although data is is visible in various formats, I have given this functionality as to, so that the user can sahre the details of Purchase Order to any person in organization who wishes to present it in a important meetings.
- **TimeStamp and History:** Reason for this is to see when a particular order has been shipped, or received or Re-opened and on which days. Timestamp is very crucial in organisations working under such domains.

## Time spent

Approximately 2-3 hours.

## Usage of Claude Code:

 I used it for the following tasks:

 - **README.md** : For documenting about authentication and drafting steps to get the application working.

- **Json Files** : I used the same purchase order txt given for assignment and asked AI to formualte it in Json.

- **File Structuring** : Allocated task for AI to help restructure the code in easier format so it becomes easy for others to understand.

- **UI** : Worked with AI to design and make UI better in terms of adaptability and easier to understand.

- **Code Formating** : Used AI to resolve the  authentication issues which we were related to jose framework.


 