'use client';

import Image from 'next/image';
import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';
import { mixedCaptureAxis as axis, stm32CaptureWindows, stm32OverlapUs } from '@/data/stm32-msi';

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const fmt = (t: number) => `${t >= 0 ? '+' : '−'}${Math.abs(t).toFixed(1)} µs`;

/**
 * A movable time cursor laid over the real mixed-capture screenshot.
 * The cursor reads time from the screenshot's own axis calibration; the readout
 * uses the real stream windows and rates from the capture's timeline table.
 * No waveform data is synthesized.
 */
export function SignalExplorer({ src, alt, width, height }: Props) {
  const [t, setT] = useState(0);
  const [dragging, setDragging] = useState(false);
  const clamp = (v: number) => Math.max(axis.minUs, Math.min(axis.maxUs, v));

  const tFromImage = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    return clamp((fx - axis.zeroX) / axis.widthPerUs);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const big = e.shiftKey ? 10 : 1;
    const map: Record<string, number> = {
      ArrowRight: t + big,
      ArrowUp: t + big,
      ArrowLeft: t - big,
      ArrowDown: t - big,
      PageUp: t + 25,
      PageDown: t - 25,
      Home: axis.minUs,
      End: axis.maxUs,
    };
    if (e.key in map) {
      e.preventDefault();
      setT(clamp(Math.round(map[e.key] * 10) / 10));
    }
  };

  const readings = stm32CaptureWindows.map((w) => {
    const inside = t >= w.startUs && t <= w.endUs;
    const sample = Math.min(w.samples - 1, Math.floor((t - w.startUs) * w.samplesPerUs));
    return { ...w, inside, sample };
  });
  const both = readings.every((r) => r.inside);
  const valueText = `${fmt(t)}: ${readings.map((r) => `${r.label} ${r.inside ? 'has data' : 'no data'}`).join(', ')}`;
  const left = `${(axis.zeroX + t * axis.widthPerUs) * 100}%`;

  return (
    <div className="space-y-4">
      <figure className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <p className="font-mono text-xs text-muted">mixed_capture.png · triggered by logic analyzer</p>
          <span className="tag-recorded">Recorded capture</span>
        </div>
        <div
          className="relative cursor-col-resize touch-pan-y"
          onPointerDown={(e) => {
            setDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
            setT(tFromImage(e));
          }}
          onPointerMove={(e) => dragging && setT(tFromImage(e))}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full select-none" draggable={false} />
          <div
            aria-hidden
            className="pointer-events-none absolute w-px bg-accent shadow-[0_0_0_1px_rgb(var(--accent)/0.25)]"
            style={{ left, top: `${axis.plotTop * 100}%`, height: `${(axis.plotBottom - axis.plotTop) * 100}%` }}
          />
          <div
            role="slider"
            tabIndex={0}
            aria-label="Time cursor"
            aria-valuemin={axis.minUs}
            aria-valuemax={axis.maxUs}
            aria-valuenow={Math.round(t * 10) / 10}
            aria-valuetext={valueText}
            onKeyDown={onKey}
            className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold text-bg sm:text-xs"
            style={{ left, top: `${axis.plotTop * 100}%` }}
          >
            {fmt(t)}
          </div>
        </div>
        <figcaption className="border-t border-line px-4 py-3 text-sm text-muted">
          One sine reaching both an analog input and a logic input: the wave above, its threshold crossings on D0
          below. Drag across the capture (or focus the cursor and use the arrow keys, Shift for ×10) to see which
          stream has data at that instant.
        </figcaption>
      </figure>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem]">
        <CoverageChart t={t} onPick={(v) => setT(clamp(v))} />
        <div className="panel p-4" aria-live="polite">
          <p className="label">Cursor readout</p>
          <p className="mt-1 font-mono text-2xl text-fg">{fmt(t)}</p>
          <dl className="mt-3 space-y-2 text-sm">
            {readings.map((r) => (
              <div key={r.id} className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">{r.label}</dt>
                <dd className={cn('whitespace-nowrap font-mono text-xs', r.inside ? 'text-accent' : 'text-dim')}>
                  {r.inside ? `sample ${r.sample} / ${r.samples}` : 'no data'}
                </dd>
              </div>
            ))}
          </dl>
          <p className={cn('mt-3 border-t border-line pt-3 text-xs', both ? 'text-muted' : 'text-warning')}>
            {both ? 'Both streams cover this instant.' : 'Only one stream has data here.'}
          </p>
        </div>
      </div>
    </div>
  );
}

const CHART = { w: 560, h: 132, left: 16, right: 544, min: -260, max: 270 };
const xOf = (us: number) => CHART.left + ((us - CHART.min) / (CHART.max - CHART.min)) * (CHART.right - CHART.left);

function CoverageChart({ t, onPick }: { t: number; onPick: (us: number) => void }) {
  const [a, d] = stm32CaptureWindows;
  const ovStart = Math.max(a.startUs, d.startUs);
  const ovEnd = Math.min(a.endUs, d.endUs);
  return (
    <div className="panel p-4">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="label">
          Stream coverage <span className="normal-case tracking-normal">· µs from trigger</span>
        </p>
        <p className="font-mono text-xs text-muted">overlap {stm32OverlapUs} µs</p>
      </div>
      <svg
        viewBox={`0 0 ${CHART.w} ${CHART.h}`}
        className="h-auto w-full cursor-col-resize"
        role="img"
        aria-label={`Analog window ${a.startUs} to +${a.endUs} µs at ${a.rate}; digital window ${d.startUs} to +${d.endUs} µs at ${d.rate}; both streams cover ${stm32OverlapUs} µs.`}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * CHART.w;
          onPick(CHART.min + ((x - CHART.left) / (CHART.right - CHART.left)) * (CHART.max - CHART.min));
        }}
      >
        <rect x={xOf(ovStart)} y={8} width={xOf(ovEnd) - xOf(ovStart)} height={84} className="fill-accent/[0.07]" />
        {[a, d].map((w, i) => (
          <g key={w.id}>
            <text x={CHART.left} y={24 + i * 40} className="fill-muted font-mono text-[11px]">
              {w.id === 'analog' ? 'ANALOG' : 'DIGITAL'} · {w.rate}
            </text>
            <rect
              x={xOf(w.startUs)}
              y={32 + i * 40}
              width={xOf(w.endUs) - xOf(w.startUs)}
              height={10}
              rx={2}
              className={i === 0 ? 'fill-warning/70' : 'fill-accent-blue/70'}
            />
          </g>
        ))}
        {/* trigger at t = 0 */}
        <line x1={xOf(0)} x2={xOf(0)} y1={4} y2={100} className="stroke-muted" strokeDasharray="3 3" />
        <text x={xOf(0) + 4} y={12} className="fill-muted font-mono text-[10px]">
          trigger
        </text>
        {/* axis */}
        <line x1={CHART.left} x2={CHART.right} y1={104} y2={104} className="stroke-line-strong" />
        {[-250, -125, 0, 125, 250].map((v) => (
          <g key={v}>
            <line x1={xOf(v)} x2={xOf(v)} y1={104} y2={108} className="stroke-line-strong" />
            <text x={xOf(v)} y={122} textAnchor="middle" className="fill-dim font-mono text-[10px]">
              {v}
            </text>
          </g>
        ))}
        {/* cursor */}
        <line x1={xOf(t)} x2={xOf(t)} y1={4} y2={104} className="stroke-accent" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
