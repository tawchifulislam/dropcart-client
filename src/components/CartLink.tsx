import Link from 'next/link';

export function CartLink() {
  return (
    <Link
      href="/cart"
      aria-label="Your cart"
      className="btn btn-quiet hidden size-11 min-h-0 px-0 sm:inline-flex"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 4h3l2 11h10l2-8H7" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
      </svg>
    </Link>
  );
}
