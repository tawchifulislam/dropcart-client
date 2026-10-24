import Link from 'next/link';
import { Container } from './Container';

const links = [
  { href: '/#drops', label: 'Drops' },
  { href: '/#catalog', label: 'Catalog' },
];

function TicketMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-brand"
    >
      <path
        d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="border-line bg-surface border-b-[1.5px]">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="display flex items-center gap-1.5 text-xl">
          <TicketMark />
          DropCart
        </Link>
        <nav
          aria-label="Main"
          className="flex items-center text-sm font-bold sm:gap-2"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center px-2.5 sm:px-3"
            >
              {label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
