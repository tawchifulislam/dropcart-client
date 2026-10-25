import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';
import { Container } from '@/components/Container';
import { safeNext } from '@/lib/safe-next';

export const metadata: Metadata = { title: 'Create account' };

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  const query = next === '/' ? '' : `?next=${encodeURIComponent(next)}`;

  return (
    <main>
      <Container className="grid min-h-[60dvh] place-items-center py-12">
        <div className="ticket w-full max-w-md p-6 md:p-8">
          <h1 className="display text-2xl">Create account</h1>
          <p className="text-ink-soft mt-1">
            One account is all you need to reserve in any drop.
          </p>
          <div className="mt-6">
            <AuthForm mode="register" next={next} />
          </div>
          <p className="text-ink-soft mt-6 text-sm">
            Already have an account?{' '}
            <Link
              href={`/login${query}`}
              className="text-brand font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
