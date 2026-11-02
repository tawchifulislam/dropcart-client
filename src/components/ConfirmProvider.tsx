'use client';

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>(
    (next) =>
      new Promise<boolean>((resolve) => {
        resolver.current?.(false);
        resolver.current = resolve;
        setOptions(next);
      }),
    [],
  );

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (options && !element.open) {
      element.showModal();
      element.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }
    if (!options && element.open) element.close();
  }, [options]);

  const settle = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  };

  const danger = options?.tone === 'danger';

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="confirm-title"
        onCancel={(event) => {
          event.preventDefault();
          settle(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) settle(false);
        }}
        className="text-ink open:animate-rise m-auto w-[calc(100%-2rem)] max-w-md bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        {options && (
          <div className="ticket bg-surface p-6">
            <h2 id="confirm-title" className="display text-xl">
              {options.title}
            </h2>
            {options.description && (
              <p className="text-ink-soft mt-2">{options.description}</p>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                data-autofocus={danger ? '' : undefined}
                onClick={() => settle(false)}
                className="btn"
              >
                {options.cancelLabel ?? 'Cancel'}
              </button>
              <button
                type="button"
                data-autofocus={danger ? undefined : ''}
                onClick={() => settle(true)}
                className={`btn ${danger ? 'btn-reserve' : 'btn-primary'}`}
              >
                {options.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context)
    throw new Error('useConfirm must be used within ConfirmProvider');
  return context;
}
