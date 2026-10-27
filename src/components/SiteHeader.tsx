import Link from 'next/link';
import { NAV_LINKS } from '@/lib/navigation';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import { ThemeToggle } from './ThemeToggle';
import { TicketMark } from './TicketMark';
import { HeaderAuth } from './HeaderAuth';
import { CartLink } from './CartLink';

export function SiteHeader() {
  return (
    <header className="border-line bg-surface/90 sticky top-0 z-40 border-b-[1.5px] backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="display flex items-center gap-1.5 text-xl">
          <TicketMark />
          DropCart
        </Link>
        <NavLinks />
        <div className="flex items-center gap-2">
          <CartLink />
          <ThemeToggle />
          <HeaderAuth />
          <MobileMenu links={NAV_LINKS} />
        </div>
      </Container>
    </header>
  );
}
