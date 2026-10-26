'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

function UserIcon() {
  return (
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function HeaderAuth() {
  const { user, status } = useAuth();

  if (status === 'loading') {
    return <span aria-hidden="true" className="size-11 md:w-24" />;
  }

  if (!user) {
    return (
      <>
        <Link
          href="/login"
          aria-label="Sign in"
          className="btn btn-quiet size-11 min-h-0 px-0 md:hidden"
        >
          <UserIcon />
        </Link>
        <Link
          href="/login"
          className="btn btn-primary hidden min-h-11 px-4 text-sm md:inline-flex"
        >
          Sign in
        </Link>
      </>
    );
  }

  return (
    <Link
      href="/account"
      aria-label="Your account"
      title="Your account"
      className="btn bg-brand text-on-brand size-11 min-h-0 rounded-full px-0"
    >
      <UserIcon />
    </Link>
  );
}
