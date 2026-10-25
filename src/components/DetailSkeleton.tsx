import { Container } from './Container';
import { Skeleton } from './Skeleton';

export function DetailSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading">
      <Container className="py-8 md:py-12">
        <Skeleton className="h-5 w-64" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Skeleton className="aspect-4/3 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
        </div>
      </Container>
    </main>
  );
}
