'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Mode = 'before' | 'after';

const RESULT: Record<Mode, { rtt: string; text: string }> = {
  before: { rtt: '19.997 ms', text: 'The callback never notifies, so each request waits for the control task’s 10 ms idle timeout before reception is rearmed.' },
  after: { rtt: '0.221 ms', text: 'RX and TX-complete callbacks notify the control task, which wakes on the interrupt instead of the timer.' },
};

/** Before/after view of the control-task wake path. Mechanism diagram, not a trace. */
export function LatencyFixDiagram() {
  const [mode, setMode] = useState<Mode>('before');
  const before = mode === 'before';

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div role="group" aria-label="Wake path" className="flex rounded-md border border-line p-0.5">
          {(['before', 'after'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                'min-h-9 rounded px-3 font-mono text-xs uppercase tracking-wider transition-colors',
                mode === m ? (m === 'before' ? 'bg-warning/15 text-warning' : 'bg-accent/15 text-accent') : 'text-dim hover:text-muted',
              )}
            >
              {m} fix
            </button>
          ))}
        </div>
        <span className="tag-illustrative">Mechanism diagram</span>
      </div>

      <div className="overflow-x-auto p-4">
        <svg viewBox="0 0 600 176" className="h-auto w-full min-w-[520px]" role="img" aria-label={`${mode} fix: ${RESULT[mode].text}`}>
          {/* ISR → notify → task */}
          <Box x={8} y={40} w={150} label="CDC RX / TX complete" sub="USB callback" tone="neutral" />
          <Box
            x={218}
            y={40}
            w={176}
            label="tasks_notify_control()"
            sub={before ? 'defined, never called' : 'called from both callbacks'}
            tone={before ? 'danger' : 'accent'}
            mono
          />
          <Box x={452} y={40} w={140} label="USB control task" sub={before ? 'sleeping' : 'wakes now'} tone={before ? 'neutral' : 'accent'} />
          <Box x={218} y={122} w={176} label="10 ms idle timeout" sub="task wait expires" tone={before ? 'warning' : 'neutral'} h={44} />

          <Edge d="M158 66 H218" on={!before} broken={before} />
          <Edge d="M394 66 H452" on={!before} broken={before} />
          <Edge d="M394 144 H424 V92 H452" on={before} warn />

          {before && (
            <text x={188} y={58} textAnchor="middle" className="fill-danger font-mono text-[13px]">
              ✕
            </text>
          )}
          <text x={8} y={22} className="fill-dim font-mono text-[10px]">
            {before ? 'WAKE SOURCE: TIMEOUT ONLY' : 'WAKE SOURCE: TASK NOTIFICATION'}
          </text>
        </svg>
      </div>

      <div className="grid gap-3 border-t border-line px-4 py-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <div>
          <p className="label">Median command RTT</p>
          <p className={cn('font-mono text-2xl', before ? 'text-warning' : 'text-accent')}>{RESULT[mode].rtt}</p>
        </div>
        <p className="text-sm text-muted">{RESULT[mode].text}</p>
      </div>
    </div>
  );
}

function Box({
  x,
  y,
  w,
  h = 52,
  label,
  sub,
  tone,
  mono,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  sub: string;
  tone: 'neutral' | 'accent' | 'warning' | 'danger';
  mono?: boolean;
}) {
  const stroke = {
    neutral: 'stroke-line-strong fill-panel-2',
    accent: 'stroke-accent fill-accent/10',
    warning: 'stroke-warning fill-warning/10',
    danger: 'stroke-danger/70 fill-danger/5',
  }[tone];
  return (
    <g className="transition-all duration-200">
      <rect x={x} y={y} width={w} height={h} rx={6} className={cn('transition-colors duration-200', stroke)} strokeDasharray={tone === 'danger' ? '4 3' : undefined} />
      <text x={x + w / 2} y={y + h / 2 - 3} textAnchor="middle" className={cn('fill-fg text-[12.5px]', mono && 'font-mono text-[11.5px]')}>
        {label}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" className="fill-muted font-mono text-[10px]">
        {sub}
      </text>
    </g>
  );
}

function Edge({ d, on, broken, warn }: { d: string; on: boolean; broken?: boolean; warn?: boolean }) {
  return (
    <g>
      <path
        d={d}
        className={cn('fill-none transition-colors duration-200', on ? (warn ? 'stroke-warning' : 'stroke-accent') : 'stroke-line-strong')}
        strokeWidth={on ? 1.75 : 1.25}
        strokeDasharray={broken ? '3 4' : undefined}
      />
      {on && <path d={d} className={cn('trace-flow fill-none', warn ? 'stroke-warning' : 'stroke-accent-strong')} strokeWidth={1.75} />}
    </g>
  );
}
