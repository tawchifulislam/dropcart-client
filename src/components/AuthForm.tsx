'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import type { User } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';

interface Props {
  mode: 'login' | 'register';
  next: string;
}

type FieldName = 'name' | 'email' | 'password';
type FieldErrors = Partial<Record<FieldName, string>>;

function firstErrors(details: unknown): FieldErrors {
  const fieldErrors =
    (
      details as
        { fieldErrors?: Record<string, string[] | undefined> } | undefined
    )?.fieldErrors ?? {};
  return {
    name: fieldErrors.name?.[0],
    email: fieldErrors.email?.[0],
    password: fieldErrors.password?.[0],
  };
}

interface FieldProps {
  name: FieldName;
  label: string;
  type: string;
  autoComplete: string;
  error?: string;
}

function Field({ name, label, type, autoComplete, error }: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-bold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="field"
      />
      {error && (
        <p id={errorId} className="text-live mt-1 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthForm({ mode, next }: Props) {
  const router = useRouter();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isRegister = mode === 'register';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setErrors({});
    setFormError(null);
    try {
      const { user } = await request<{ user: User }>(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setUser(user);
      toast({
        tone: 'success',
        title: isRegister ? 'Account created' : 'Welcome back',
        description: user.name,
      });
      router.replace(next);
      router.refresh();
    } catch (error) {
      if (error instanceof HttpError && error.status === 400) {
        setErrors(firstErrors(error.details));
      } else {
        setFormError(
          error instanceof HttpError
            ? error.message
            : 'Network error. Please try again.',
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {isRegister && (
        <Field
          name="name"
          label="Name"
          type="text"
          autoComplete="name"
          error={errors.name}
        />
      )}
      <Field
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
      />
      <Field
        name="password"
        label="Password"
        type="password"
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        error={errors.password}
      />
      {isRegister && (
        <p className="text-ink-soft text-sm">Use at least 8 characters.</p>
      )}
      {formError && (
        <p
          role="alert"
          className="rounded-control bg-live-wash p-3 text-sm font-bold"
        >
          {formError}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary w-full">
        {busy ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
}
