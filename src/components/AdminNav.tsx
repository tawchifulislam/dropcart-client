'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/drops', label: 'Drops' },
  { href: '/admin/products', label: 'Products' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
    >
      {LINKS.map(({ href, label }) => {
        const active =
          href === '/admin' ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-control inline-flex min-h-11 shrink-0 items-center border-[1.5px] px-4 text-sm font-bold ${
              active
                ? 'border-line bg-brand text-on-brand'
                : 'hover:bg-sunk border-transparent'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
