import type { Metadata } from 'next';
import { MockCheckout } from '@/components/MockCheckout';

export const metadata: Metadata = {
  title: 'Test payment',
  robots: { index: false },
};

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function MockCheckoutPage({ params }: Props) {
  const { orderId } = await params;
  return <MockCheckout orderId={orderId} />;
}
