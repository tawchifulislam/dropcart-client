import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminGate } from '@/components/AdminGate';
import { AdminNav } from '@/components/AdminNav';
import { Container } from '@/components/Container';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGate>
      <main>
        <Container className="grid gap-6 py-8 lg:grid-cols-[200px_1fr] lg:gap-10 lg:py-12">
          <AdminNav />
          <div className="min-w-0">{children}</div>
        </Container>
      </main>
    </AdminGate>
  );
}
