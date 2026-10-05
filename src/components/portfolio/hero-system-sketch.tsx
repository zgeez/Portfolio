'use client';

import { useState } from 'react';
import Link from 'next/link';

const LAYERS = [
  { id: 'product', label: 'Product', title: 'One USB bench instrument', detail: 'A waveform generator, oscilloscope and logic analyzer controlled from a PC.', blocks: ['Mixed-Signal Instrument'] },
  { id: 'system', label: 'System', title: 'Host ↔ USB CDC ↔ STM32F407', detail: 'The host application sends commands and receives captures over one USB link.', blocks: ['PC APP', 'USB CDC', 'STM32F407'] },
  { id: 'firmware', label: 'Firmware', title: 'Four FreeRTOS tasks', detail: 'Waveform refill, acquisition, USB control and status each have a separate responsibility.', blocks: ['REFILL', 'ACQ', 'USB CTRL', 'STATUS'] },
  { id: 'hardware', label: 'Hardware', title: 'DAC, dual ADC and GPIO sampling', detail: 'DMA moves samples. Chained hardware timers release analog and digital capture onto one timeline.', blocks: ['DAC / AWG', 'ADC / SCOPE', 'GPIO / LOGIC'] },
  { id: 'signals', label: 'Signals', title: 'Inspect the timing behind the traces', detail: 'Measured logic capture: 9.882 MS/s. Measured analog/digital skew: −120 ns. Open the case study for the capture and its limits.', blocks: [] },
] as const;
const ROW = [26, 78, 130, 182, 234];

/** A small layer selector; the waveforms are illustrative rather than recorded data. */
export function HeroSystemSketch() {
  const [active, setActive] = useState(0);
  const layer = LAYERS[active];
  return (
    <div className="relative border-y border-line py-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="eyebrow">Abstraction lens</p>
        <span className="tag-illustrative">Illustrative sketch</span>
      </div>
      <h2 className="mt-2 text-lg font-medium text-fg">Peel the system apart</h2>
      <p id="hero-lens-hint" className="mt-1 text-xs text-muted">Select a layer to inspect the STM32 instrument.</p>
      <div role="group" aria-label="Abstraction layer" aria-describedby="hero-lens-hint" className="mt-3 grid grid-cols-5 border-y border-line">
        {LAYERS.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={index === active} aria-controls="hero-lens-detail" onClick={() => setActive(index)}
            className={`min-h-11 border-b-2 px-1 font-mono text-[0.6rem] transition-colors sm:text-[0.68rem] ${index === active ? 'border-accent bg-accent/5 text-accent' : 'border-transparent text-muted hover:bg-panel hover:text-fg'}`}>
            {item.label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 500 280" className="mt-3 h-auto w-full" aria-hidden="true">
        {LAYERS.map((item, index) => {
          const width = item.blocks.length === 1 ? 316 : item.blocks.length === 4 ? 84 : 112;
          const start = item.blocks.length === 1 ? 140 : 110;
          const spacing = item.blocks.length === 4 ? 94 : 128;
          return (
            <g key={item.id}>
              <line x1={92} x2={496} y1={ROW[index] + 32} y2={ROW[index] + 32} className="stroke-line" strokeDasharray="2 6" />
              <text x={0} y={ROW[index] + 6} className="fill-dim font-mono text-[10px] tracking-[0.12em]">L{index}</text>
              <text x={0} y={ROW[index] + 20} className={`font-mono text-[9px] tracking-[0.12em] transition-colors ${index === active ? 'fill-accent' : 'fill-dim'}`}>{item.label.toUpperCase()}</text>
              <g className="transition-[opacity,transform] duration-300" style={{ opacity: index === active ? 1 : index < active ? 0.2 : 0.5, transform: `translateX(${index === active ? 4 : 0}px)` }}>
                {index > 1 && index < 4 && <path d={`M405 ${ROW[index - 1] + 20} V${ROW[index] - 18}`} className="stroke-line-strong" />}
                {item.blocks.map((block, blockIndex) => (
                  <g key={block}>
                    {index === 1 && blockIndex > 0 && <line x1={start + (blockIndex - 1) * spacing + width} x2={start + blockIndex * spacing} y1={ROW[index]} y2={ROW[index]} className="stroke-accent/50" />}
                    <rect x={start + blockIndex * spacing} y={ROW[index] - 18} width={width} height={36} rx={3} className={`fill-panel ${index === active ? 'stroke-accent/70' : 'stroke-line-strong'}`} />
                    <text x={start + blockIndex * spacing + width / 2} y={ROW[index] + 4} textAnchor="middle" className={`fill-fg ${index === 0 ? 'text-[14px] font-medium' : 'font-mono text-[10px]'}`}>{block}</text>
                  </g>
                ))}
                {index === 4 && <>
                  <path d={`M110 ${ROW[4] - 2} ${Array.from({ length: 40 }, (_, sample) => `L${(110 + sample * 9.5).toFixed(1)} ${(ROW[4] - 2 - 13 * Math.sin((sample / 39) * Math.PI * 4)).toFixed(1)}`).join(' ')}`} className="fill-none stroke-warning" strokeWidth={1.5} />
                  <path d={`M110 ${ROW[4] + 16} H202.6 V${ROW[4] + 28} H295.3 V${ROW[4] + 16} H387.9 V${ROW[4] + 28} H480.5`} className="fill-none stroke-accent-blue" strokeWidth={1.5} />
                  <line x1={295.3} x2={295.3} y1={ROW[4] - 22} y2={ROW[4] + 34} className="stroke-muted" strokeDasharray="3 3" />
                </>}
              </g>
            </g>
          );
        })}
      </svg>
      <div id="hero-lens-detail" aria-live="polite" aria-atomic="true" className="min-h-32 border-t border-line pt-4">
        <p className="font-mono text-xs text-accent">L{active} / {layer.label}</p>
        <p className="mt-2 text-sm font-medium text-fg">{layer.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{layer.detail}</p>
      </div>
      <Link href={`/projects/stm32-mixed-signal-instrument/#lens-${layer.id}`} className="mt-2 inline-flex min-h-11 items-center font-mono text-xs text-accent hover:text-accent-strong">
        Explore {layer.label.toLowerCase()} layer →
      </Link>
    </div>
  );
}
