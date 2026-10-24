'use client';

import Image from 'next/image';
import { useState } from 'react';

export function HeroBackdrop({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        onError={() => setFailed(true)}
        className="object-cover brightness-75 contrast-125 grayscale"
      />
      <div className="bg-brand absolute inset-0 opacity-60 mix-blend-multiply" />
      <div className="bg-canvas/60 absolute inset-0 lg:bg-transparent" />
      <div className="from-canvas via-canvas/75 to-canvas/10 absolute inset-0 bg-linear-to-r from-30%" />
      <div className="from-canvas absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent" />
    </div>
  );
}
