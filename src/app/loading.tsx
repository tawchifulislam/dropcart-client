import { Container } from '@/components/Container';
import { Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading">
      <Container className="space-y-6 py-12">
        <Skeleton className="h-12 w-2/3 max-w-xl" />
        <Skeleton className="h-6 w-full max-w-prose" />
        <Skeleton className="h-64 w-full" />
      </Container>
    </main>
  );
}
