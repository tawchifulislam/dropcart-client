'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import {
  fieldErrorsOf,
  fromLocalInput,
  numberOrUndefined,
  toLocalInput,
} from '@/lib/admin-forms';
import { HttpError, request } from '@/lib/browser-api';
import { formatPrice } from '@/lib/format';
import type { DropWithProduct, ManagedProduct } from '@/lib/types';
import { FormField, fieldProps } from './FormField';
import { Skeleton } from './Skeleton';
import { useToast } from './ToastProvider';

interface Props {
  drop?: DropWithProduct;
  defaultProductId?: string;
}

export function DropForm({ drop, defaultProductId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<ManagedProduct[] | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const editing = Boolean(drop);
  const locked = editing && drop?.status !== 'upcoming';

  useEffect(() => {
    let cancelled = false;
    request<{ items: ManagedProduct[] }>('/admin/products')
      .then((result) => {
        if (!cancelled) setProducts(result.items);
      })
      .catch(() => {
        if (!cancelled) setFormError('We could not load your products.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      productId: String(data.get('productId') ?? ''),
      startsAt: fromLocalInput(data.get('startsAt')),
      endsAt: fromLocalInput(data.get('endsAt')),
      dropPrice: numberOrUndefined(data.get('dropPrice')),
      stockTotal: numberOrUndefined(data.get('stockTotal')),
    };

    setBusy(true);
    setErrors({});
    setFormError(null);
    try {
      await request(editing ? `/admin/drops/${drop?.id}` : '/admin/drops', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      toast({
        tone: 'success',
        title: editing ? 'Drop updated' : 'Drop scheduled',
      });
      router.push('/admin/drops');
    } catch (caught) {
      if (caught instanceof HttpError && caught.status === 400) {
        setErrors(fieldErrorsOf(caught.details));
      }
      setFormError(
        caught instanceof HttpError
          ? caught.message
          : 'Network error. Please try again.',
      );
      setBusy(false);
    }
  };

  if (products === null && !formError)
    return <Skeleton className="h-96 w-full" />;

  if (products && products.length === 0) {
    return (
      <div className="ticket border-dashed p-6 text-center">
        <p className="display text-xl">Create a product first</p>
        <p className="text-ink-soft mt-1">
          A drop sells one of your products, so you need one before scheduling.
        </p>
        <Link href="/admin/products/new" className="btn btn-primary mt-4">
          Create a product
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {locked && (
        <p
          role="status"
          className="rounded-control bg-upcoming-wash p-3 text-sm font-bold"
        >
          This drop has already started or ended, so it can no longer be
          changed.
        </p>
      )}

      <FormField id="productId" label="Product" error={errors.productId}>
        <select
          {...fieldProps('productId', errors.productId)}
          defaultValue={drop?.product.id ?? defaultProductId ?? ''}
          disabled={locked}
          className="field"
        >
          <option value="" disabled>
            Choose a product
          </option>
          {products?.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({formatPrice(product.basePrice)})
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="startsAt" label="Starts" error={errors.startsAt}>
          <input
            {...fieldProps('startsAt', errors.startsAt)}
            type="datetime-local"
            defaultValue={drop ? toLocalInput(drop.startsAt) : ''}
            disabled={locked}
            className="field"
          />
        </FormField>
        <FormField id="endsAt" label="Ends" error={errors.endsAt}>
          <input
            {...fieldProps('endsAt', errors.endsAt)}
            type="datetime-local"
            defaultValue={drop ? toLocalInput(drop.endsAt) : ''}
            disabled={locked}
            className="field"
          />
        </FormField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          id="dropPrice"
          label="Drop price (৳)"
          error={errors.dropPrice}
        >
          <input
            {...fieldProps('dropPrice', errors.dropPrice)}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            defaultValue={drop?.dropPrice}
            disabled={locked}
            className="field"
          />
        </FormField>
        <FormField
          id="stockTotal"
          label="Units"
          hint="The fixed number of units in this drop."
          error={errors.stockTotal}
        >
          <input
            {...fieldProps('stockTotal', errors.stockTotal)}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            defaultValue={drop?.stockTotal}
            disabled={locked}
            className="field"
          />
        </FormField>
      </div>

      <p className="text-ink-soft text-sm">
        Times use the timezone of this browser. Customers see them in Bangladesh
        time.
      </p>

      {formError && (
        <p
          role="alert"
          className="rounded-control bg-live-wash p-3 text-sm font-bold"
        >
          {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy || locked}
          className="btn btn-primary"
        >
          {busy ? 'Saving...' : editing ? 'Save changes' : 'Schedule drop'}
        </button>
        <Link href="/admin/drops" className="btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}
