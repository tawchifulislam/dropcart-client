import Link from 'next/link';
import { Reveal } from './Reveal';

interface Props {
  id: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeading({
  id,
  title,
  href,
  linkLabel = 'View all',
}: Props) {
  return (
    <Reveal>
      <div className="flex items-end justify-between gap-4">
        <h2 id={id} className="display text-2xl md:text-3xl">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-brand shrink-0 text-sm font-bold hover:underline"
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </Reveal>
  );
}
