import Link from 'next/link';
import { Container } from '@/components/Container';

export default function NotFound() {
  return (
    <main>
      <Container className="py-24 text-center">
        <p className="display text-brand text-4xl">404</p>
        <h1 className="display mt-2 text-2xl">This page is sold out</h1>
        <p className="text-ink-soft mt-2">
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Back to home
        </Link>
      </Container>
    </main>
  );
}
