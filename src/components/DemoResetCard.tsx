'use client';

import { useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { useAuth } from './AuthProvider';
import { useConfirm } from './ConfirmProvider';
import { useToast } from './ToastProvider';

export function DemoResetCard({ onReset }: { onReset: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);

  if (user?.role !== 'superadmin') return null;

  const reset = async () => {
    const confirmed = await confirm({
      title: 'Reset the demo data?',
      description:
        'Sample products and fresh live drops are restored. Orders, reservations, carts and chats are cleared. Accounts are kept.',
      confirmLabel: 'Reset demo data',
      tone: 'danger',
    });
    if (!confirmed) return;

    setBusy(true);
    try {
      await request('/admin/demo/reset', { method: 'POST' });
      toast({
        tone: 'success',
        title: 'Demo data reset',
        description: 'Fresh sample products and live drops are ready.',
      });
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
