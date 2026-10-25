import Link from 'next/link';
import { NAV_LINKS } from '@/lib/navigation';
import { Container } from './Container';
import { TicketMark } from './TicketMark';

const ACCOUNT_LINKS = [
  { href: '/login', label: 'Sign in' },
  { href: '/register', label: 'Create account' },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className="font-bold">{title}</h2>
      <ul className="text-ink-soft mt-3 space-y-2 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="hover:text-ink hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-line bg-surface border-t-[1.5px]">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="display flex items-center gap-1.5 text-xl">
            <TicketMark />
            DropCart
          </p>
          <p className="text-ink-soft mt-3 max-w-sm text-sm">
            Limited drops with a fixed number of units. Reserve yours for five
            minutes, pay, and it is yours.
          </p>
        </div>
        <FooterColumn title="Explore" links={NAV_LINKS} />
        <FooterColumn title="Account" links={ACCOUNT_LINKS} />
      </Container>
      <div className="border-line border-t-[1.5px] border-dashed">
        <Container className="text-ink-soft flex flex-col gap-1 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} DropCart. Prices in BDT.</p>
          <p>Built with Next.js, Express and MongoDB.</p>
        </Container>
      </div>
    </footer>
  );
}
