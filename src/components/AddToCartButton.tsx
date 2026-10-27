'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';

export function AddToCartButton({
  productId,
  name,
}: {
  productId: string;
  name: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    try {
      await request('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      toast({ tone: 'success', title: 'Added to cart', description: name });
    } catch (caught) {
      toast({
        tone: 'error',
        title: 'Could not add to cart',
        description: caught instanceof HttpError ? caught.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={add}
      disabled={busy || status === 'loading'}
      className="btn"
    >
      Add to cart
    </button>
  );
}
