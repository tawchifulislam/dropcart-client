'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import {
  fieldErrorsOf,
  linesToList,
  linesToSpecs,
  numberOrUndefined,
  specsToLines,
} from '@/lib/admin-forms';
import { HttpError, request } from '@/lib/browser-api';
import type { ManagedProduct } from '@/lib/types';
import { FormField, fieldProps } from './FormField';
import { useToast } from './ToastProvider';

export function ProductForm({ product }: { product?: ManagedProduct }) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const editing = Boolean(product);

  useEffect(() => {
    let cancelled = false;
    request<{ items: string[] }>('/products/categories')
      .then((result) => {
        if (!cancelled) setCategories(result.items);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get('name') ?? ''),
      category: String(data.get('category') ?? ''),
      description: String(data.get('description') ?? ''),
      basePrice: numberOrUndefined(data.get('basePrice')),
      images: linesToList(String(data.get('images') ?? '')),
      variants: linesToList(String(data.get('variants') ?? '')).map(
        (label) => ({ label }),
      ),
      specs: linesToSpecs(String(data.get('specs') ?? '')),
    };

    setBusy(true);
    setErrors({});
    setFormError(null);
    try {
      await request(
        editing ? `/admin/products/${product?.id}` : '/admin/products',
        {
          method: editing ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        },
      );
      toast({
        tone: 'success',
        title: editing ? 'Product updated' : 'Product created',
        description: payload.name,
      });
      router.push('/admin/products');
    } catch (caught) {
      if (caught instanceof HttpError && caught.status === 400) {
        setErrors(fieldErrorsOf(caught.details));
        setFormError(caught.message);
      } else {
        setFormError(
          caught instanceof HttpError
            ? caught.message
            : 'Network error. Please try again.',
        );
      }
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="name" label="Name" error={errors.name}>
          <input
            {...fieldProps('name', errors.name)}
            defaultValue={product?.name}
            autoComplete="off"
            className="field"
          />
        </FormField>
        <FormField
          id="category"
          label="Category"
          hint="Pick an existing category or type a new one."
          error={errors.category}
        >
          <input
            {...fieldProps('category', errors.category)}
            defaultValue={product?.category}
            list="category-options"
            autoComplete="off"
            className="field"
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </FormField>
      </div>

      <FormField
        id="basePrice"
        label="Regular price (৳)"
        hint="The price shown outside a drop."
        error={errors.basePrice}
      >
        <input
          {...fieldProps('basePrice', errors.basePrice)}
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          defaultValue={product?.basePrice}
          className="field md:max-w-xs"
        />
      </FormField>

      <FormField
        id="description"
        label="Description"
        error={errors.description}
      >
        <textarea
          {...fieldProps('description', errors.description)}
          defaultValue={product?.description}
          rows={4}
          className="field py-3"
        />
      </FormField>

      <FormField
        id="images"
        label="Images"
        hint="One per line. Use a full URL, or a path such as /products/jacket.jpg. The first image is the main one."
        error={errors.images}
      >
        <textarea
          {...fieldProps('images', errors.images)}
          defaultValue={product?.images.join('\n')}
          rows={3}
          className="field py-3"
        />
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          id="variants"
          label="Options"
          hint="One per line, for example sizes: S, M, L."
          error={errors.variants}
        >
          <textarea
            {...fieldProps('variants', errors.variants)}
            defaultValue={product?.variants
              .map((variant) => variant.label)
              .join('\n')}
            rows={4}
            className="field py-3"
          />
        </FormField>
        <FormField
          id="specs"
          label="Details"
          hint="One per line as Name: value, for example Material: Linen."
          error={errors.specs}
        >
          <textarea
            {...fieldProps('specs', errors.specs)}
            defaultValue={specsToLines(product?.specs ?? {})}
            rows={4}
            className="field py-3"
          />
        </FormField>
      </div>

      {formError && !Object.values(errors).some(Boolean) && (
        <p
          role="alert"
          className="rounded-control bg-live-wash p-3 text-sm font-bold"
        >
          {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? 'Saving...' : editing ? 'Save changes' : 'Create product'}
        </button>
        <Link href="/admin/products" className="btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}
