import type { ReactNode } from 'react';

interface Props {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, hint, error, children }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-live mt-1 text-sm font-bold">
          {error}
        </p>
      ) : hint ? (
        <p className="text-ink-soft mt-1 text-sm">{hint}</p>
      ) : null}
    </div>
  );
}

export const fieldProps = (id: string, error?: string) => ({
  id,
  name: id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : undefined,
});
