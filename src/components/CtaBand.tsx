'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { Reveal } from './Reveal';

export function CtaBand() {
  const { user, status } = useAuth();
  if (status === 'loading') return null;

  const firstName = user?.name.split(' ')[0];

  return (
    <section aria-labelledby="cta-heading" className="pt-16">
      <Reveal>
        <div className="ticket bg-ink text-canvas flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 id="cta-heading" className="display text-2xl md:text-3xl">
              {user
                ? `Welcome back, ${firstName}.`
                : 'The next drop will not wait.'}
            </h2>
            <p className="mt-2 max-w-prose opacity-80">
              {user
                ? 'Check your reservations, or jump straight into whatever is live right now.'
                : 'Create an account now so you can reserve the moment a drop goes live.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {user ? (
              <>
                <Link href="/account" className="btn btn-reserve">
                  My account
                </Link>
                <Link href="/drops" className="btn">
                  See live drops
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" className="btn btn-reserve">
                  Create account
                </Link>
                <Link href="/drops" className="btn">
                  See upcoming drops
                </Link>
              </>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
