'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/navigation';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-control hover:bg-sunk relative inline-flex min-h-11 items-center px-3 text-sm font-bold ${
              active ? 'text-brand' : ''
            }`}
          >
            {label}
            {active && (
              <motion.span
                layoutId="nav-underline"
                className="bg-brand absolute inset-x-3 bottom-1 h-0.5"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
