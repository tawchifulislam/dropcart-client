'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

const DEBOUNCE_MS = 300;

export function CatalogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlValue = searchParams.get('search') ?? '';

  const [value, setValue] = useState(urlValue);
  const [scheduled, setScheduled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);

  if (!scheduled && !isPending && urlValue !== value.trim()) {
    setValue(urlValue);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  const commit = (next: string) => {
    if (next === urlValue) return;
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set('search', next);
    else params.delete('search');
    params.delete('page');
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const update = (next: string, delay: number) => {
    clearTimeout(timer.current);
    const trimmed = next.trim();
    if (delay === 0 || trimmed === '') {
      setScheduled(false);
      commit(trimmed);
      return;
    }
    setScheduled(true);
    timer.current = setTimeout(() => {
      setScheduled(false);
      commit(trimmed);
    }, delay);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    update(event.target.value, DEBOUNCE_MS);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    update(value, 0);
  };

  const clear = () => {
    setValue('');
    update('', 0);
    input.current?.focus();
  };

  return (
    <form role="search" onSubmit={onSubmit} className="relative">
      <input
        ref={input}
        type="search"
        name="search"
        value={value}
        onChange={onChange}
        placeholder="Search products"
        aria-label="Search products"
        enterKeyHint="search"
        autoComplete="off"
        className="field pr-20 [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute inset-y-0 right-2 flex items-center gap-2">
        {isPending && (
          <span
            aria-hidden="true"
            className="border-line size-4 animate-spin rounded-full border-2 border-t-transparent"
          />
        )}
        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="rounded-chip text-ink-soft hover:bg-sunk hover:text-ink grid size-8 place-items-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
      <span role="status" className="sr-only">
        {isPending ? 'Updating results' : ''}
      </span>
    </form>
  );
}
