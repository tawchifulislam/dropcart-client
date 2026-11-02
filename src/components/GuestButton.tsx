'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import type { User } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';

interface Props {
  next?: string;
  label?: string;
  className?: string;
}

export function GuestButton({
  next,
  label = 'Continue as a guest',
  className = 'btn w-full',
}: Props) {
  const router = useRouter();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;

  const start = async () => {
    setBusy(true);
    try {
      const { user } = await request<{ user: User }>('/auth/guest', {
        method: 'POST',
      });
      setUser(user);
      toast({
        tone: 'success',
        title: `Signed in as ${user.name}`,
        description: 'Guest accounts are deleted after a day.',
      });
      if (next) router.replace(next);
      router.refresh();
    } catch (caught) {
      toast({
        tone: 'error',
        title: 'Could not start a guest session',
        description: caught instanceof HttpError ? caught.message : undefined,
      });
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void start()}
      disabled={busy}
      className={className}
    >
      {busy ? 'Starting...' : label}
    </button>
  );
}
