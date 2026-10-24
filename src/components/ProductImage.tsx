'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Props {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export function ProductImage({
  src,
  alt,
  sizes,
  className = '',
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const frame = `relative overflow-hidden rounded-lg border-[1.5px] border-line ${className}`;

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${frame} grid place-items-center bg-[repeating-linear-gradient(135deg,var(--brand-wash)_0_12px,var(--surface)_12px_24px)]`}
      >
        <span aria-hidden="true" className="display text-ink-soft text-3xl">
          {initials(alt)}
        </span>
      </div>
    );
  }

  return (
    <div className={frame}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="object-cover"
      />
    </div>
  );
}
