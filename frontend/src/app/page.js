import SessionList from '@/components/SessionList';

async function getSessions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch sessions');
  }
  return res.json();
}

export default async function Home() {
  const sessions = await getSessions();

  return (
    <main className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="text-xl font-semibold tracking-tight mb-1">Sessions</h1>
      <p className="text-sm text-slate-500 mb-6">
        {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} recorded
      </p>
      <SessionList sessions={sessions} />
    </main>
  );
}
