'use client';

import { motion } from 'framer-motion';

interface Line {
  text: string;
  className?: string;
}

export function AnimatedHeading({ id, lines }: { id: string; lines: Line[] }) {
  let offset = 0;
  const prepared = lines.map((line) => {
    const words = line.text.split(' ');
    const start = offset;
    // eslint-disable-next-line react-hooks/immutability
    offset += words.length;
    return { ...line, words, start };
  });

  return (
    <h1 id={id} className="display text-[clamp(2.5rem,8vw,5.5rem)]">
      {prepared.map((line) => (
        <span key={line.text} className={`block ${line.className ?? ''}`}>
          {line.words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.08 * (line.start + index),
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
