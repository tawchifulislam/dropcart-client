'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

interface NavLink {
  href: string;
  label: string;
}

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(!open)}
        className="btn btn-quiet size-11 min-h-0 px-0"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-line bg-surface shadow-sheet absolute inset-x-0 top-full border-b-[1.5px] p-4"
        >
          <ul className="space-y-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  className="rounded-control hover:bg-sunk flex min-h-12 items-center px-3 font-bold"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link href="/account" onClick={close} className="btn btn-primary">
                My account
              </Link>
              <button
                type="button"
                onClick={() => {
                  close();
                  void logout();
                }}
                className="btn"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={close}
              className="btn btn-primary mt-3 w-full"
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
