import { GuestButton } from './GuestButton';

export function GuestPrompt({ next }: { next: string }) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;

  return (
    <div className="rounded-control border-line bg-brand-wash mt-6 border-[1.5px] p-4">
      <p className="font-bold">Just looking around?</p>
      <p className="text-ink-soft mt-1 text-sm">
        Skip the sign-up and try the whole store with a temporary guest account.
      </p>
      <div className="mt-3">
        <GuestButton next={next} className="btn btn-primary w-full" />
      </div>
    </div>
  );
}
