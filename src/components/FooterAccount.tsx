'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

const linkClass = 'hover:text-ink hover:underline';

export function FooterAccount() {
  const { user, logout } = useAuth();

  return (
    <nav aria-label="Account">
      <h2 className="font-bold">Account</h2>
      <ul className="text-ink-soft mt-3 space-y-2 text-sm">
        {user ? (
          <>
            <li>
              <Link href="/account" className={linkClass}>
                My account
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => void logout()}
                className={linkClass}
              >
                Sign out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login" className={linkClass}>
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/register" className={linkClass}>
                Create account
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
