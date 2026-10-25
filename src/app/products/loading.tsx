import { Container } from '@/components/Container';
import { Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading catalog">
      <section className="border-line border-b-[1.5px]">
        <Container className="space-y-3 py-10 md:py-14">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-full max-w-prose" />
        </Container>
      </section>
      <Container className="pt-8 pb-20">
        <Skeleton className="h-12 w-full" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-60" />
          ))}
        </div>
      </Container>
    </main>
  );
}
