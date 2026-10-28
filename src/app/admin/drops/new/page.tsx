import type { Metadata } from 'next';
import { DropForm } from '@/components/DropForm';

export const metadata: Metadata = { title: 'Schedule a drop' };

interface Props {
  searchParams: Promise<{ product?: string }>;
}

export default async function NewDropPage({ searchParams }: Props) {
  const { product } = await searchParams;
  return (
    <div className="space-y-6">
      <h1 className="display text-2xl md:text-3xl">Schedule a drop</h1>
      <DropForm defaultProductId={product} />
    </div>
  );
}
