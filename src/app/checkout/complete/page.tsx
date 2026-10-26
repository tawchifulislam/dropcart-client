import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckoutComplete } from '@/components/CheckoutComplete';

export const metadata: Metadata = {
  title: 'Order status',
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutCompletePage({ searchParams }: Props) {
  const { order } = await searchParams;
  if (!order) notFound();
  return <CheckoutComplete orderId={order} />;
}
