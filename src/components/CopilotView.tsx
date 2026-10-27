'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatPrice } from '@/lib/format';
import type {
  CartItem,
  CopilotAction,
  CopilotMessage,
  ProductCard,
} from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { ProductImage } from './ProductImage';
import { Skeleton } from './Skeleton';
import { useToast } from './ToastProvider';

const SUGGESTIONS = [
  'A gift under 2000 taka for a rainy day',
  'What is live right now?',
  'Something nice for the kitchen',
];

function makePending(text: string): CopilotMessage {
  return {
    id: `pending-${crypto.randomUUID()}`,
    role: 'user',
    text,
    trace: [],
    products: [],
    actions: [],
    createdAt: new Date().toISOString(),
  };
}

const BADGES: Record<
  ProductCard['status'],
  { label: string; className: string }
> = {
  live: { label: 'Live', className: 'badge badge-live' },
  upcoming: { label: 'Upcoming', className: 'badge badge-upcoming' },
  sold_out: { label: 'Sold out', className: 'badge' },
  no_drop: { label: 'No drop', className: 'badge' },
};

function ProductMini({
  card,
  inCart,
  onAdd,
}: {
  card: ProductCard;
  inCart: boolean;
  onAdd: (card: ProductCard) => void;
}) {
  const badge = BADGES[card.status];
  const showStock = card.status === 'live' && card.stockRemaining !== undefined;

  return (
    <li className="ticket flex items-center gap-3 p-3">
      <ProductImage
        src={card.image}
        alt={card.name}
        sizes="56px"
        className="h-14 w-14 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${card.slug}`}
          className="block truncate font-bold hover:underline"
        >
          {card.name}
        </Link>
        <p className="display text-lg">{formatPrice(card.price)}</p>
        <span className={badge.className}>
          {showStock ? `${card.stockRemaining} left` : badge.label}
        </span>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        {card.status === 'live' && card.dropId && (
          <Link
            href={`/drops/${card.dropId}`}
            className="btn btn-primary min-h-10 px-3 text-sm"
          >
            Open drop
          </Link>
        )}
        <button
          type="button"
          onClick={() => onAdd(card)}
          disabled={inCart}
          className="btn min-h-10 px-3 text-sm"
        >
          {inCart ? 'In cart' : 'Add to cart'}
        </button>
      </div>
    </li>
  );
}

function ActionCard({
  action,
  inCart,
  onUndo,
}: {
  action: CopilotAction;
  inCart: boolean;
  onUndo: (action: CopilotAction) => void;
}) {
  return (
    <div className="ticket border-brand border-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="badge badge-ok">
          {inCart ? 'Added to cart' : 'Removed from cart'}
        </span>
        <span className="text-ink-soft text-xs">Done by Copilot</span>
      </div>
      <p className="mt-2 font-bold">{action.name}</p>
      <p className="text-ink-soft text-sm">
        Quantity {action.quantity}. Not reserved yet, reserve it while its drop
        is live.
      </p>
      <div className="mt-3 flex gap-2">
        {inCart && (
          <button
            type="button"
            onClick={() => onUndo(action)}
            className="btn min-h-10 flex-1 text-sm"
          >
            Undo
          </button>
        )}
        <Link href="/cart" className="btn btn-primary min-h-10 flex-1 text-sm">
          View cart
        </Link>
      </div>
    </div>
  );
}

export function CopilotView() {
  const { user, status } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [cartIds, setCartIds] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const loadCart = useCallback(async () => {
    try {
      const { items } = await request<{ items: CartItem[] }>('/cart');
      setCartIds(new Set(items.map((item) => item.product.id)));
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([
      request<{ messages: CopilotMessage[] }>('/copilot/session'),
      request<{ items: CartItem[] }>('/cart'),
    ])
      .then(([session, cart]) => {
        if (cancelled) return;
        setMessages(session.messages);
        setCartIds(new Set(cart.items.map((item) => item.product.id)));
      })
      .catch(() => {
        if (!cancelled) setError('We could not load your conversation.');
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, sending]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    setSending(true);
    setInput('');

    const pending = makePending(trimmed);

    setMessages((current) => [...current, pending]);

    try {
      const { message } = await request<{ message: CopilotMessage }>(
        '/copilot/chat',
        {
          method: 'POST',
          body: JSON.stringify({ message: trimmed }),
        },
      );
      setMessages((current) => [...current, message]);
      if (message.actions.length > 0) await loadCart();
    } catch (caught) {
      setError(
        caught instanceof HttpError
          ? caught.message
          : 'Network error. Please try again.',
      );
      setInput(trimmed);
      setMessages((current) =>
        current.filter((item) => item.id !== pending.id),
      );
    } finally {
      setSending(false);
    }
  };

  const addCard = async (card: ProductCard) => {
    try {
      await request('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId: card.id, quantity: 1 }),
      });
      toast({
        tone: 'success',
        title: 'Added to cart',
        description: card.name,
      });
      await loadCart();
    } catch (caught) {
      toast({
        tone: 'error',
        title: 'Could not add to cart',
        description: caught instanceof HttpError ? caught.message : undefined,
      });
    }
  };

  const undo = async (action: CopilotAction) => {
    try {
      await request(`/cart/items/${action.productId}`, { method: 'DELETE' });
      toast({
        tone: 'info',
        title: 'Removed from cart',
        description: action.name,
      });
      await loadCart();
    } catch {
      toast({ tone: 'error', title: 'Could not undo that' });
    }
  };

  const reset = async () => {
    try {
      await request('/copilot/session', { method: 'DELETE' });
      setMessages([]);
      setError(null);
      toast({ tone: 'info', title: 'Conversation cleared' });
    } catch {
      toast({ tone: 'error', title: 'Could not clear the conversation' });
    }
  };

  if (status === 'ready' && !user) {
    return (
      <main>
        <Container className="py-12">
          <div className="ticket mx-auto max-w-xl p-8 text-center">
            <h1 className="display text-2xl">Sign in to use the Copilot</h1>
            <p className="text-ink-soft mt-2">
              The Copilot searches the catalog and manages your cart, so it
              needs your account.
            </p>
            <Link
              href="/login?next=%2Fcopilot"
              className="btn btn-primary mt-5"
            >
              Sign in
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container className="py-6 md:py-10">
        <section
          aria-label="Copilot"
          className="ticket mx-auto flex h-[75dvh] min-h-120 max-w-3xl flex-col"
        >
          <header className="border-line flex items-center justify-between gap-3 border-b-[1.5px] p-4">
            <div>
              <h1 className="display text-xl">DropCart Copilot</h1>
              <p className="text-ink-soft text-sm">
                Search the catalog and fill your cart.
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => void reset()}
                className="btn min-h-10 px-3 text-sm"
              >
                New chat
              </button>
            )}
          </header>

          <div
            role="log"
            aria-live="polite"
            className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4"
          >
            {!user || !loaded ? (
              <Skeleton className="h-24 w-2/3" />
            ) : (
              messages.length === 0 && (
                <div className="py-6 text-center">
                  <p className="display text-xl">What are you looking for?</p>
                  <p className="text-ink-soft mt-1">
                    Describe it in your own words, or try one of these.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void send(suggestion)}
                        className="btn min-h-10 px-3 text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}

            {messages.map((message) =>
              message.role === 'user' ? (
                <div
                  key={message.id}
                  className="bg-ink text-canvas ml-auto w-fit max-w-[85%] rounded-[14px_14px_4px_14px] px-4 py-2"
                >
                  {message.text}
                </div>
              ) : (
                <div key={message.id} className="max-w-[92%] space-y-2">
                  {message.trace.map((line) => (
                    <p
                      key={line}
                      className="rounded-control bg-sunk text-ink-soft w-fit px-3 py-1.5 text-sm"
                    >
                      {line}
                    </p>
                  ))}
                  <p className="ticket w-fit rounded-[14px_14px_14px_4px] px-4 py-2">
                    {message.text}
                  </p>
                  {message.products.length > 0 && (
                    <ul className="space-y-2">
                      {message.products.map((card) => (
                        <ProductMini
                          key={card.id}
                          card={card}
                          inCart={cartIds.has(card.id)}
                          onAdd={(item) => void addCard(item)}
                        />
                      ))}
                    </ul>
                  )}
                  {message.actions.map((action) => (
                    <ActionCard
                      key={action.productId}
                      action={action}
                      inCart={cartIds.has(action.productId)}
                      onUndo={(item) => void undo(item)}
                    />
                  ))}
                </div>
              ),
            )}

            {sending && (
              <div
                className="ticket flex w-fit gap-1.5 rounded-[14px_14px_14px_4px] px-4 py-3"
                aria-label="Copilot is typing"
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="bg-ink-soft size-2 animate-pulse rounded-full"
                    style={{ animationDelay: `${dot * 0.2}s` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="border-line border-t-[1.5px] p-3"
          >
            {error && (
              <p
                role="alert"
                className="rounded-control bg-live-wash mb-2 p-2 text-sm font-bold"
              >
                {error}
              </p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                rows={2}
                maxLength={500}
                placeholder="Ask for a product, a budget, or what is live"
                aria-label="Message the Copilot"
                disabled={!user}
                className="field min-h-12 flex-1 resize-none py-3"
              />
              <button
                type="submit"
                disabled={sending || !input.trim() || !user}
                aria-label="Send message"
                className="btn btn-primary size-12 shrink-0 px-0"
              >
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
                  <path d="M4 12l16-8-6 16-3-7z" />
                </svg>
              </button>
            </div>
          </form>
        </section>
      </Container>
    </main>
  );
}
