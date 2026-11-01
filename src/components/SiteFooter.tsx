import Link from 'next/link';
import { NAV_LINKS } from '@/lib/navigation';
import { Container } from './Container';
import { FooterAccount } from './FooterAccount';
import { TicketMark } from './TicketMark';

const REPO_LINKS = [
  { label: 'Web app source', href: process.env.NEXT_PUBLIC_REPO_URL },
  { label: 'API source', href: process.env.NEXT_PUBLIC_API_REPO_URL },
].filter((link): link is { label: string; href: string } => Boolean(link.href));

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
        <div>
          <p className="display flex items-center gap-1.5 text-xl">
            <TicketMark />
            DropCart
          </p>
          <p className="text-ink-soft mt-3 max-w-xs text-sm">
            Limited drops with a fixed number of units. Reserve yours for five
            minutes, pay, and it is yours.
          </p>
        </div>
        <FooterColumn
          title="Explore"
          links={[{ href: '/', label: 'Home' }, ...NAV_LINKS]}
        />
        <FooterAccount />
        <div>
          <h2 className="font-bold">Project</h2>
          <ul className="text-ink-soft mt-3 space-y-2 text-sm">
            {REPO_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-ink-soft mt-3 text-sm">
            Built with Next.js, Express, MongoDB, Stripe and Gemini.
          </p>
        </div>
      </Container>
      <div className="border-line border-t-[1.5px] border-dashed">
        <Container className="text-ink-soft flex flex-col gap-1 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} DropCart. Prices in BDT.</p>
          <p>Every unit counted.</p>
        </Container>
      </div>
    </footer>
  );
}
