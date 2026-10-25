'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export function HeaderAuth() {
  const { user, status, logout } = useAuth();

  if (status === 'loading') {
    return <span aria-hidden="true" className="hidden h-11 w-24 md:block" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="btn btn-primary hidden min-h-11 px-4 text-sm md:inline-flex"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="hidden items-center gap-3 md:flex">
      <span className="max-w-32 truncate text-sm font-bold">{user.name}</span>
      <button
        type="button"
        onClick={() => void logout()}
        className="btn min-h-11 px-4 text-sm"
      >
        Sign out
      </button>
    </div>
  );
}
