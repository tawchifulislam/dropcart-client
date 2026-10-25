'use client';

import { useState } from 'react';
import { ProductImage } from './ProductImage';

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <ProductImage
        key={images[active]}
        src={images[active]}
        alt={name}
        sizes="(min-width: 1024px) 560px, 100vw"
        priority
        className="aspect-4/3 w-full"
      />
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active}
                className={`block w-full rounded-lg ${
                  index === active
                    ? 'ring-brand ring-offset-surface ring-2 ring-offset-2'
                    : ''
                }`}
              >
                <ProductImage
                  src={src}
                  alt=""
                  sizes="96px"
                  className="aspect-square w-full"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
