'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { Skeleton } from './Skeleton';

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === 'ready' && !user) router.replace('/login?next=%2Fadmin');
  }, [status, user, router]);

  if (!user) {
    return (
      <Container className="space-y-4 py-12">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-72 w-full" />
      </Container>
    );
  }

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return (
      <Container className="py-16">
        <div className="ticket mx-auto max-w-lg p-8 text-center">
          <h1 className="display text-2xl">Admins only</h1>
          <p className="text-ink-soft mt-2">
            Your account does not have access to this area.
          </p>
          <Link href="/" className="btn mt-5">
            Back to home
          </Link>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}
