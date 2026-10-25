import Link from 'next/link';

interface Props {
  page: number;
  totalPages: number;
  prevHref: string | null;
  nextHref: string | null;
}

export function Pagination({ page, totalPages, prevHref, nextHref }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-between gap-4"
    >
      {prevHref ? (
        <Link href={prevHref} className="btn">
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className="btn is-sold">
          Previous
        </span>
      )}
      <span className="text-ink-soft text-sm">
        Page {page} of {totalPages}
      </span>
      {nextHref ? (
        <Link href={nextHref} className="btn">
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className="btn is-sold">
          Next
        </span>
      )}
    </nav>
  );
}
