'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Tone = 'success' | 'info' | 'error';

interface ToastInput {
  title: string;
  description?: string;
  tone?: Tone;
}

interface ToastData extends ToastInput {
  id: number;
  tone: Tone;
}

interface ToastApi {
  toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DURATION_MS = 4500;
const MAX_TOASTS = 3;

const ICON_PATH: Record<Tone, string> = {
  success: 'M5 12l5 5 9-10',
  info: 'M12 8v.01M12 12v5',
  error: 'M12 7v6M12 17v.01',
};

const ICON_BACKGROUND: Record<Tone, string> = {
  success: 'bg-ok',
  info: 'bg-brand',
  error: 'bg-live',
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: number) => void;
}) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => onDismiss(toast.id), DURATION_MS);
    return () => clearTimeout(timer);
  }, [paused, toast.id, onDismiss]);

  return (
    <motion.div
      layout
      role={toast.tone === 'error' ? 'alert' : 'status'}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      onHoverStart={() => setPaused(true)}
      onHoverEnd={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="ticket shadow-sheet pointer-events-auto flex w-full max-w-sm items-start gap-3 p-3"
    >
      <span
        aria-hidden="true"
        className={`text-canvas grid size-8 shrink-0 place-items-center rounded-full ${ICON_BACKGROUND[toast.tone]}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={ICON_PATH[toast.tone]} />
        </svg>
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="font-bold">{toast.title}</p>
        {toast.description && (
          <p className="text-ink-soft text-sm">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="rounded-chip text-ink-soft hover:bg-sunk hover:text-ink grid size-8 shrink-0 place-items-center"
      >
        <svg
          width="14"
          height="14"
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
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    nextId.current += 1;
    const item: ToastData = {
      ...input,
      tone: input.tone ?? 'info',
      id: nextId.current,
    };
    setToasts((current) => [...current, item].slice(-MAX_TOASTS));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end">
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <ToastItem key={item.id} toast={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
