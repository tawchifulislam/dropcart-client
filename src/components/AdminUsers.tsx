'use client';

import { useEffect, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatDate } from '@/lib/format';
import type { ManagedUser, User } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Skeleton } from './Skeleton';
import { useToast } from './ToastProvider';

const ROLE_OPTIONS: User['role'][] = ['shopper', 'admin', 'superadmin'];

const WARNINGS: Record<User['role'], string> = {
  shopper: 'They will lose access to the admin area immediately.',
  admin: 'They will be able to create and manage their own products and drops.',
  superadmin:
    "They will see and change everything in the store, including other users' roles.",
};

export function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<ManagedUser[] | null>(null);
  const [failed, setFailed] = useState(false);
  const isSuperadmin = user?.role === 'superadmin';

  useEffect(() => {
    if (!isSuperadmin) return;
    let cancelled = false;
    const term = query.trim();
    const timer = setTimeout(
      () => {
        request<{ items: ManagedUser[] }>(
          `/admin/users${term ? `?search=${encodeURIComponent(term)}` : ''}`,
        )
          .then((result) => {
            if (cancelled) return;
            setUsers(result.items);
            setFailed(false);
          })
          .catch(() => {
            if (!cancelled) setFailed(true);
          });
      },
      term ? 300 : 0,
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isSuperadmin, query]);

  const changeRole = async (target: ManagedUser, role: User['role']) => {
    if (role === target.role) return;
    if (!window.confirm(`Change ${target.name} to ${role}? ${WARNINGS[role]}`))
      return;
    try {
      const updated = await request<{ role: User['role'] }>(
        `/admin/users/${target.id}/role`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role }),
        },
      );
      setUsers(
        (current) =>
          current?.map((item) =>
            item.id === target.id ? { ...item, role: updated.role } : item,
          ) ?? null,
      );
      toast({
        tone: 'success',
        title: 'Role updated',
        description: `${target.name} is now ${updated.role}`,
      });
    } catch (caught) {
      toast({
        tone: 'error',
        title: 'Could not change the role',
        description: caught instanceof HttpError ? caught.message : undefined,
      });
    }
  };

  if (!isSuperadmin) {
    return (
      <div className="ticket p-8 text-center">
        <h1 className="display text-2xl">Superadmins only</h1>
        <p className="text-ink-soft mt-2">
          Only a superadmin can manage user roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-2xl md:text-3xl">Users</h1>
        <div className="w-full sm:w-72">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>
          <input
            id="user-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email"
            autoComplete="off"
            className="field"
          />
        </div>
      </div>

      <p className="text-ink-soft max-w-prose">
        Someone becomes an admin only after you agree it with them. Admins
        manage their own products and drops. You cannot change your own role.
      </p>

      {failed && (
        <p role="alert" className="rounded-control bg-live-wash p-3 font-bold">
          We could not load the users. Please refresh the page.
        </p>
      )}

      {!failed && users === null && <Skeleton className="h-64 w-full" />}

      {users && users.length === 0 && (
        <p className="text-ink-soft">No users match your search.</p>
      )}

      {users && users.length > 0 && (
        <div className="ticket overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-line text-ink-soft border-b-[1.5px]">
                <th className="px-4 py-2 font-normal">User</th>
                <th className="px-4 py-2 font-normal">Role</th>
                <th className="px-4 py-2 font-normal">Products</th>
                <th className="px-4 py-2 font-normal">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr
                  key={item.id}
                  className="border-line border-b border-dashed last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-ink-soft">{item.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {item.id === user?.id ? (
                      <span className="font-bold">{item.role} (you)</span>
                    ) : (
                      <select
                        aria-label={`Role for ${item.name}`}
                        value={item.role}
                        onChange={(event) =>
                          void changeRole(
                            item,
                            event.target.value as User['role'],
                          )
                        }
                        className="field min-h-10 w-auto"
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">{item.products}</td>
                  <td className="text-ink-soft px-4 py-3">
                    {formatDate(item.joinedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
