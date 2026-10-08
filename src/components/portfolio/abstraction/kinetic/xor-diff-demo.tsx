'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// Standard 7-segment font, bit order g f e d c b a (bit 0 = a).
const FONT = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f];
const SEGMENTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const;

// Segment bars in a 100×170 box.
const BARS: Record<(typeof SEGMENTS)[number], string> = {
  a: 'M24 10 h52 l8 8 l-8 8 h-52 l-8 -8 z',
  b: 'M84 22 l8 8 v46 l-8 8 l-8 -8 v-46 z',
  c: 'M84 90 l8 8 v46 l-8 8 l-8 -8 v-46 z',
  d: 'M24 146 h52 l8 8 l-8 8 h-52 l-8 -8 z',
  e: 'M16 90 l8 8 v46 l-8 8 l-8 -8 v-46 z',
  f: 'M16 22 l8 8 v46 l-8 8 l-8 -8 v-46 z',
  g: 'M24 78 h52 l8 8 l-8 8 h-52 l-8 -8 z',
};

const bin = (m: number) => m.toString(2).padStart(7, '0');
const popcount = (m: number) => bin(m).split('').filter((b) => b === '1').length;

/**
 * Runs the documented firmware rule: XOR the desired mask with the current one
 * and pulse only the bars that differ.
 */
export function XorDiffDemo() {
  const [from, setFrom] = useState(9);
  const [to, setTo] = useState(8);
  const cur = FONT[from];
  const next = FONT[to];
  const diff = cur ^ next;
  const pulses = popcount(diff);

  const step = () => {
    setFrom(to);
    setTo((to + 9) % 10); // count down, as in the demo video
  };

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <p className="label">XOR diff · which bars move</p>
        <span className="tag-illustrative">Illustrative · standard 7-segment font</span>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
        <div className="flex items-center justify-center gap-5">
          <Digit mask={cur} diff={diff} next={next} label={`From ${from}`} dimUnchanged />
          <span aria-hidden className="font-mono text-accent">→</span>
          <Digit mask={next} label={`To ${to}`} />
        </div>

        <div className="space-y-4">
          <dl className="grid grid-cols-3 gap-3 font-mono text-sm">
            {[
              ['current', bin(cur)],
              ['desired', bin(next)],
              ['xor', bin(diff)],
            ].map(([k, v]) => (
              <div key={k} className="border-l border-line pl-3">
                <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-dim">{k}</dt>
                <dd className={k === 'xor' ? 'text-accent' : 'text-fg'}>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="font-mono text-[0.68rem] text-dim">bit order g f e d c b a</p>
          <p aria-live="polite" className="text-sm text-muted">
            <span className="font-mono text-2xl text-fg">{pulses}</span> of 7 bars pulse for {from} → {to}; the
            other {7 - pulses} draw nothing.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={step}
              className="min-h-10 rounded-md border border-accent/50 px-3 font-mono text-xs uppercase tracking-[0.14em] text-accent hover:bg-accent/10"
            >
              Next count ↓
            </button>
            <span className="label ml-2">or pick a target</span>
            <div role="group" aria-label="Target digit" className="flex flex-wrap gap-1">
              {FONT.map((_, d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={d === to}
                  onClick={() => {
                    setFrom(to);
                    setTo(d);
                  }}
                  className={cn(
                    'h-10 w-9 rounded border font-mono text-sm transition-colors',
                    d === to ? 'border-accent bg-accent/15 text-accent' : 'border-line text-muted hover:border-line-strong',
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="border-t border-line px-4 py-3 text-xs text-dim">
        Bars that turn on are drawn in mint, bars that turn off in amber; coil polarity sets the direction of travel.
        The firmware’s own glyphs may differ slightly from this standard font.
      </p>
    </div>
  );
}

function Digit({
  mask,
  diff = 0,
  next = mask,
  label,
  dimUnchanged,
}: {
  mask: number;
  diff?: number;
  next?: number;
  label: string;
  dimUnchanged?: boolean;
}) {
  return (
    <figure className="text-center">
      <svg viewBox="0 0 100 172" className="h-36 w-auto" role="img" aria-label={label}>
        {SEGMENTS.map((s, i) => {
          const bit = 1 << i;
          const on = (mask & bit) !== 0;
          const changes = (diff & bit) !== 0;
          const turningOn = changes && (next & bit) !== 0;
          return (
            <path
              key={s}
              d={BARS[s]}
              className={cn(
                'transition-colors duration-200',
                changes
                  ? turningOn
                    ? 'fill-accent/25 stroke-accent'
                    : 'fill-warning/70 stroke-warning'
                  : on
                    ? dimUnchanged
                      ? 'fill-fg/50 stroke-transparent'
                      : 'fill-fg stroke-transparent'
                    : 'fill-line/60 stroke-transparent',
              )}
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <figcaption className="mt-1 font-mono text-[0.68rem] text-dim">{label}</figcaption>
    </figure>
  );
}
