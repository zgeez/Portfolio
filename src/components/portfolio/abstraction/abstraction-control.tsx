'use client';

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  count: number;
  index: number;
  valueText: string;
  onChange: (index: number) => void;
  className?: string;
};

const SWEEP = 270; // degrees between the first and last detent
const START = -SWEEP / 2;
const C = 60; // svg centre

/**
 * A rotary-encoder style control with one detent per layer.
 * Wheel input is only captured while the pointer is over the dial, and is released
 * at either end stop so the page keeps scrolling normally.
 */
export function AbstractionControl({ count, index, valueText, onChange, className }: Props) {
  const dialRef = useRef<HTMLDivElement>(null);
  const state = useRef({ index, onChange, acc: 0, lastStep: 0, dragging: false });
  state.current.index = index;
  state.current.onChange = onChange;

  const step = SWEEP / (count - 1);
  const angleFor = (i: number) => START + i * step;

  useEffect(() => {
    const el = dialRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const s = state.current;
      const dir = Math.sign(e.deltaY);
      const atEnd = (dir > 0 && s.index >= count - 1) || (dir < 0 && s.index <= 0);
      if (dir === 0 || atEnd) return; // let the page scroll past the end stops
      e.preventDefault();
      s.acc += e.deltaY;
      const now = performance.now();
      if (Math.abs(s.acc) >= 40 && now - s.lastStep > 160) {
        s.onChange(s.index + dir);
        s.acc = 0;
        s.lastStep = now;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [count]);

  const indexFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const deg = (Math.atan2(x, -y) * 180) / Math.PI; // 0° = up, clockwise positive
    const clamped = Math.max(START, Math.min(-START, deg));
    return Math.round((clamped - START) / step);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    state.current.dragging = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(indexFromPointer(e));
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!state.current.dragging) return;
    const next = indexFromPointer(e);
    if (next !== state.current.index) onChange(next);
  };
  const onPointerUp = () => {
    state.current.dragging = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowUp: index + 1,
      PageUp: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index - 1,
      PageDown: index - 1,
      Home: 0,
      End: count - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      onChange(Math.max(0, Math.min(count - 1, keys[e.key])));
    }
  };

  return (
    <div className={cn('select-none', className)}>
      <div
        ref={dialRef}
        role="slider"
        tabIndex={0}
        aria-label="Abstraction depth"
        aria-valuemin={0}
        aria-valuemax={count - 1}
        aria-valuenow={index}
        aria-valuetext={valueText}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="mx-auto aspect-square w-36 cursor-grab touch-none rounded-full active:cursor-grabbing"
      >
        <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" aria-hidden>
          {/* sweep arc */}
          <path
            d={arcPath(C, C, 52, START, -START)}
            className="fill-none stroke-line"
            strokeWidth={1}
          />
          <path
            d={arcPath(C, C, 52, START, Math.max(START + 0.01, angleFor(index)))}
            className="fill-none stroke-accent/60 transition-all duration-300"
            strokeWidth={1.5}
          />
          {/* detents */}
          {Array.from({ length: count }, (_, i) => {
            const a = angleFor(i);
            const [x1, y1] = polar(C, C, 47, a);
            const [x2, y2] = polar(C, C, 52, a);
            const [lx, ly] = polar(C, C, 59, a);
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={1.5}
                  className={cn('transition-colors', i === index ? 'stroke-accent' : 'stroke-line-strong')}
                />
                <text
                  x={lx}
                  y={ly + 2.5}
                  textAnchor="middle"
                  className={cn('font-mono text-[7px]', i === index ? 'fill-accent' : 'fill-dim')}
                >
                  {i}
                </text>
              </g>
            );
          })}
          {/* knob body with knurling */}
          <circle cx={C} cy={C} r={38} className="fill-panel-2 stroke-line-strong" strokeWidth={1} />
          {Array.from({ length: 48 }, (_, i) => {
            const a = (i * 360) / 48;
            const [x1, y1] = polar(C, C, 35, a);
            const [x2, y2] = polar(C, C, 38, a);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-line" strokeWidth={0.8} />;
          })}
          <circle cx={C} cy={C} r={29} className="fill-panel stroke-line" strokeWidth={1} />
          {/* indicator */}
          <g
            style={{
              transform: `rotate(${angleFor(index)}deg)`,
              transformOrigin: `${C}px ${C}px`,
              transition: 'transform 260ms cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
          >
            <line x1={C} y1={C - 12} x2={C} y2={C - 26} className="stroke-accent" strokeWidth={2.5} strokeLinecap="round" />
          </g>
          <circle cx={C} cy={C} r={2} className="fill-line-strong" />
        </svg>
      </div>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}
