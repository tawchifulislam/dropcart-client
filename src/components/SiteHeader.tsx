import Link from 'next/link';

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
    <header className="border-b-[1.5px] border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="display flex items-center gap-1.5 text-xl">
          <TicketMark />
          DropCart
        </Link>
        <nav aria-label="Main" className="flex gap-6 text-sm font-bold">
          <Link href="/#drops">Drops</Link>
          <Link href="/#catalog">Catalog</Link>
        </nav>
      </div>
    </header>
  );
}
