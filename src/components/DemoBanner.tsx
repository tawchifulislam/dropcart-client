import Link from 'next/link';

export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;

  return (
    <div className="bg-ink text-canvas px-4 py-2 text-center text-sm">
      <b>Demo store.</b> Payments run in test mode and no real money is charged.{' '}
      <Link href="/how-it-works" className="font-bold underline">
        See how it works
      </Link>
    </div>
  );
}
