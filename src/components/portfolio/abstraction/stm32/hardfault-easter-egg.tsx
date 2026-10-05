'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Plausible Cortex-M register values for the joke. None of this is device data.
const LINES: { k: string; v: string; note?: string }[] = [
  { k: 'CFSR', v: '0x00008200', note: 'PRECISERR · BFARVALID' },
  { k: 'HFSR', v: '0x40000000', note: 'FORCED' },
  { k: 'BFAR', v: '0x20030000', note: 'past the end of SRAM' },
  { k: 'PC', v: '0x08001A3C' },
  { k: 'LR', v: '0xFFFFFFFD', note: 'EXC_RETURN · thread · PSP' },
];

const STEP_MS = 180;
const RECOVER_AT = LINES.length + 2;
const CLOSE_AFTER_MS = 2900;

/**
 * "Break abstraction": a discreet, clearly SIMULATED HardFault dump over the
 * deepest layer. Recovers on its own in under three seconds; Escape or a click
 * dismisses immediately. Reduced motion shows a static card instead.
 */
export function HardFaultEasterEgg({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const [reduced, setReduced] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(isReduced);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    if (isReduced) {
      setShown(RECOVER_AT + 1);
      return () => window.removeEventListener('keydown', onKey);
    }
    setShown(0);
    const timers = Array.from({ length: RECOVER_AT + 1 }, (_, i) => window.setTimeout(() => setShown(i + 1), 120 + i * STEP_MS));
    timers.push(window.setTimeout(close, CLOSE_AFTER_MS));
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const recovered = shown > RECOVER_AT;

  return (
    <div className="relative">
      {children}

      <div className="mt-10 flex justify-end">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-9 rounded border border-dashed border-line-strong px-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-dim transition-colors hover:border-danger/50 hover:text-danger"
        >
          Break abstraction
        </button>
      </div>

      {open && (
        <div
          className="absolute inset-0 z-30 animate-fade-in rounded-lg bg-danger/[0.07] backdrop-blur-[2px]"
          onClick={close}
          style={{ boxShadow: 'inset 0 0 0 1px rgb(var(--danger) / 0.35)' }}
        >
          <div className="sticky top-[calc(var(--header-h)+5rem)] flex justify-center px-4 pt-10">
            <div
              role="dialog"
              aria-modal="false"
              aria-label="Simulated Cortex-M HardFault"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-lg border border-danger/50 bg-bg/95 p-5 font-mono text-sm shadow-2xl"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="tag-simulated">Simulated</span>
                <button ref={closeRef} type="button" onClick={close} className="min-h-8 px-2 text-xs text-dim hover:text-fg">
                  Esc ✕
                </button>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-danger">Simulated Cortex-M HardFault</p>
              <p className="mt-1 text-lg font-semibold text-danger">*** HARDFAULT ***</p>
              <dl className="mt-3 space-y-1 text-xs">
                {LINES.map((l, i) => (
                  <div key={l.k} className={cn('grid grid-cols-[3rem_6.5rem_1fr] gap-2 transition-opacity duration-150', shown > i ? 'opacity-100' : 'opacity-0')}>
                    <dt className="text-muted">{l.k}</dt>
                    <dd className="text-fg">{l.v}</dd>
                    <dd className="truncate text-dim">{l.note}</dd>
                  </div>
                ))}
              </dl>
              <p className={cn('mt-4 text-xs text-warning transition-opacity', shown > LINES.length ? 'opacity-100' : 'opacity-0')}>
                watchdog recovery…
              </p>
              <p className={cn('mt-1 text-sm text-accent transition-opacity', recovered ? 'opacity-100' : 'opacity-0')}>
                SYSTEM RECOVERED ✓
              </p>
              <p className="mt-4 border-t border-line pt-3 font-sans text-xs text-dim">
                An Easter egg, not a crash: the page is fine and these registers are made up.
                {reduced ? '' : ' Recovers on its own.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
