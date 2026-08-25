import Image from 'next/image';
import Link from 'next/link';
import { AccountMenu } from './AccountMenu';

export function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/Brand Logo.png"
            alt="NHF Supply Chain"
            width={42}
            height={36}
            className="shrink-0"
          />
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
              Purchase Orders
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              NHF Supply Chain
            </p>
          </div>
        </Link>
        <AccountMenu />
      </div>
    </header>
  );
}
