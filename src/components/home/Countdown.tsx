
"use client"

import { useState, useEffect } from 'react';

export function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(timer);
      } else {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <div className="animate-pulse h-6 w-24 bg-pink-100 rounded-full" />;

  return (
    <div className="flex gap-1 font-mono text-xs font-bold text-primary">
      <span>{timeLeft.d}d</span>
      <span>{timeLeft.h}h</span>
      <span>{timeLeft.m}m</span>
      <span>{timeLeft.s}s</span>
    </div>
  );
}
