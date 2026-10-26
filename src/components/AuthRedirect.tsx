'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './AuthProvider';

export function AuthRedirect({ to }: { to: string }) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace(to);
  }, [user, router, to]);

  return null;
}
