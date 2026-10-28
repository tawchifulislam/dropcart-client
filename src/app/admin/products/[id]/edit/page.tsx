import type { Metadata } from 'next';
import { ProductEditor } from '@/components/AdminEditors';

export const metadata: Metadata = { title: 'Edit product' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <h1 className="display text-2xl md:text-3xl">Edit product</h1>
      <ProductEditor id={id} />
    </div>
  );
}
