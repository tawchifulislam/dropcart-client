import type { Metadata } from 'next';
import { ProductForm } from '@/components/ProductForm';

export const metadata: Metadata = { title: 'New product' };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="display text-2xl md:text-3xl">New product</h1>
      <ProductForm />
    </div>
  );
}
