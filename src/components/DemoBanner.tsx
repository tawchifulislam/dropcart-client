import Link from 'next/link';

export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;

  return (
    <div className="border-line bg-brand-wash border-b-[1.5px] px-4 py-1.5 text-center text-sm">
      <b>Demo store.</b>{' '}
      <span className="hidden sm:inline">
        Payments run in test mode, no real money is charged.{' '}
      </span>
      <span className="sm:hidden">Test payments only. </span>
      <Link href="/about" className="font-bold underline">
        See how it is built
      </Link>
    </div>
  );
}
