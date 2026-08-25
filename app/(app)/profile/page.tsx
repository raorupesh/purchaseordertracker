import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function formatDob(dob: string) {
  return new Date(`${dob}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const fields = [
    { label: 'First Name', value: user.firstName },
    { label: 'Last Name', value: user.lastName },
    { label: 'Email', value: user.email },
    { label: 'Date of Birth', value: formatDob(user.dob) },
    { label: 'Position', value: user.position },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
      <h2 className="text-sm font-semibold text-slate-700">Profile</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-lg border border-slate-200 px-4 py-3"
          >
            <div className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">
              {label}
            </div>
            <div className="text-sm text-slate-800">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
