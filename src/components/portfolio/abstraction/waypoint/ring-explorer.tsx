'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils';
import { pointer, ringStates } from '@/data/waypoint';
import { LedRing } from './led-ring';

/** Pick a render state to see what the ring shows and why. */
export function RingStateExplorer() {
  const [active, setActive] = useState(ringStates.findIndex((s) => s.id === 'nav'));
  const state = ringStates[active];
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:items-center">
      <LedRing pixels={state.pixels} pulse={state.pulse} label={`${state.name}: ${state.trigger}`} className="mx-auto w-48 md:w-full" />
      <div>
        <p className="label">Render priority · highest first</p>
        <ol role="list" className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {ringStates.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  'flex min-h-11 w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors duration-150',
                  i === active ? 'border-accent/60 bg-accent/10' : 'border-line hover:border-line-strong',
                )}
              >
                <span className="font-mono text-[0.68rem] text-dim">{i + 1}</span>
                <span>
                  <span className={cn('block text-sm', i === active ? 'text-fg' : 'text-muted')}>{s.name}</span>
                  <span className="block text-xs text-dim">{s.trigger}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const BEARING = 214.9; // from the live session in the write-up
const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

/**
 * Runs the firmware's documented mapping in the browser:
 *   delta = wrap(bearing − heading); pixel = round(delta / 22.5°) mod 16
 */
export function HeadingToPixel() {
  const id = useId();
  const [heading, setHeading] = useState(158);
  const delta = wrap180(BEARING - heading);
  const pixel = (((Math.round(delta / 22.5)) % 16) + 16) % 16;
  const turn = Math.abs(delta) < 0.05 ? 'Dead ahead' : `Turn ${Math.abs(delta).toFixed(0)}° ${delta > 0 ? 'right' : 'left'}`;

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <p className="label">Heading → pixel</p>
        <span className="tag-illustrative">Illustrative · runs the documented mapping</span>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:items-center">
        <LedRing pixels={pointer(pixel)} label={`Target pixel ${pixel} relative to the forward pixel`} className="mx-auto w-44 md:w-full" />
        <div className="space-y-4">
          <div>
            <label htmlFor={id} className="flex items-baseline justify-between text-sm text-muted">
              Device heading
              <span className="font-mono text-fg">{heading.toFixed(0)}°</span>
            </label>
            <input
              id={id}
              type="range"
              min={0}
              max={359}
              step={1}
              value={heading}
              onChange={(e) => setHeading(Number(e.target.value))}
              className="mt-2 h-11 w-full cursor-pointer accent-[rgb(var(--accent))]"
            />
          </div>
          <dl className="grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-4">
            {[
              ['bearing', `${BEARING}°`],
              ['delta', `${delta >= 0 ? '+' : '−'}${Math.abs(delta).toFixed(1)}°`],
              ['pixel', `${pixel}`],
              ['ring says', turn],
            ].map(([k, v]) => (
              <div key={k} className="border-l border-line pl-3">
                <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-dim">{k}</dt>
                <dd className={k === 'ring says' ? 'text-accent' : 'text-fg'}>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-dim">
            Seeded with the session in the write-up: heading 158°, bearing 214.9° places the target three pixels
            clockwise. Taking the shortest signed turn before quantizing keeps the pointer from jumping across the ring
            when heading crosses north.
          </p>
        </div>
      </div>
    </div>
  );
}
