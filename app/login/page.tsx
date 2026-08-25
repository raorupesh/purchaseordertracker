import Image from 'next/image';
import { LoginForm } from '@/components/LoginForm';

// Auth is enforced by middleware.ts: an already-logged-in user is redirected
// away from this route before it ever renders.
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Image
            src="/Brand Logo.png"
            alt="NHF Supply Chain"
            width={64}
            height={56}
            className="mx-auto mb-3"
          />
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Purchase Orders
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-mono">
            NHF Supply Chain
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 px-6 py-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
