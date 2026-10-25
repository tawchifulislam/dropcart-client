'use client';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';

const SPRING = { stiffness: 150, damping: 20 };

export function TiltStage({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), SPRING);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), SPRING);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="perspective-distant"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div style={{ rotateX, rotateY }}>{children}</motion.div>
    </div>
  );
}
