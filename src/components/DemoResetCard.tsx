'use client';

import { useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';

export function DemoResetCard({ onReset }: { onReset: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  if (user?.role !== 'superadmin') return null;

  const reset = async () => {
    const confirmed = window.confirm(
      'Reset the demo? This restores the sample products and fresh drops, and clears orders, reservations, carts and chats. Accounts are kept.',
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      await request('/admin/demo/reset', { method: 'POST' });
      toast({ tone: 'success', title: 'Demo data reset' });
      onReset();
    } catch (caught) {
      toast({
        tone: 'error',
        title: 'Could not reset the demo',
        description: caught instanceof HttpError ? caught.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-labelledby="demo-heading"
      className="ticket bg-upcoming-wash flex flex-wrap items-center justify-between gap-4 p-4"
    >
      <div>
        <h2 id="demo-heading" className="display text-lg">
          Demo data
        </h2>
        <p className="text-ink-soft text-sm">
          Restore the sample products and fresh live drops. Orders,
          reservations, carts and chats are cleared.
        </p>
      </div>
      <button
        type="button"
        onClick={() => void reset()}
        disabled={busy}
        className="btn"
      >
        {busy ? 'Resetting...' : 'Reset demo data'}
      </button>
    </section>
  );
}
