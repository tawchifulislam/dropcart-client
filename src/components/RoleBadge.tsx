import type { User } from '@/lib/types';

const ROLES: Record<
  User['role'],
  { label: string; className: string; path: string }
> = {
  shopper: {
    label: 'Shopper',
    className: 'bg-surface text-ink',
    path: 'M6 7h12l-1 12H7L6 7zM9 7a3 3 0 0 1 6 0',
  },
  admin: {
    label: 'Admin',
    className: 'bg-brand text-on-brand',
    path: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z',
  },
  superadmin: {
    label: 'Superadmin',
    className: 'bg-upcoming text-on-upcoming',
    path: 'M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.4 9.3l6-.7L12 3z',
  },
};

export function RoleBadge({ role }: { role: User['role'] }) {
  const { label, className, path } = ROLES[role];

  return (
    <span
      className={`border-line inline-flex h-8 items-center gap-1.5 rounded-full border-[1.5px] px-3 text-sm font-bold ${className}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
      {label}
    </span>
  );
}
