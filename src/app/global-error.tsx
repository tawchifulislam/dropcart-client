'use client';

import './globals.css';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="display text-3xl">Something went wrong</h1>
          <p className="text-ink-soft mt-2">
            The page failed to load. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="btn btn-primary mt-6"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
