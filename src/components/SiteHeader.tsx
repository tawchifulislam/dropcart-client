import Link from 'next/link';
import { NAV_LINKS } from '@/lib/navigation';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import { TicketMark } from './TicketMark';

export function SiteHeader() {
  return (
    <header className="border-line bg-surface/90 sticky top-0 z-40 border-b-[1.5px] backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="display flex items-center gap-1.5 text-xl">
          <TicketMark />
          DropCart
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-control hover:bg-sunk inline-flex min-h-11 items-center px-3 text-sm font-bold"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="btn btn-primary hidden min-h-11 px-4 text-sm md:inline-flex"
          >
            Sign in
          </Link>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </Container>
    </header>
  );
}
