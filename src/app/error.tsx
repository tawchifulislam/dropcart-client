'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Container } from '@/components/Container';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <Container className="py-24 text-center">
        <p className="display text-live text-4xl">Oops</p>
        <h1 className="display mt-2 text-2xl">Something went wrong</h1>
        <p className="text-ink-soft mt-2">
          We could not load this page. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn">
            Back to home
          </Link>
        </div>
      </Container>
    </main>
  );
}
