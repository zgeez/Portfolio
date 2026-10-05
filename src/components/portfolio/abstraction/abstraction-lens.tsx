'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AbstractionControl } from './abstraction-control';

export type LensLayerMeta = {
  id: string;
  label: string;
  caption?: string;
};

type Props = {
  layers: LensLayerMeta[];
  /** One panel per layer, same order. Rendered on the server and passed in. */
  panels: ReactNode[];
  /** Hash prefix used for deep links, e.g. `#lens-firmware`. */
  hashPrefix?: string;
};

/**
 * The Abstraction Lens: peel a system from product down to signals.
 * Every panel is in the HTML; the lens only chooses which one is visible, so the
 * content works without JavaScript gestures and normal page scroll is never hijacked.
 */
export function AbstractionLens({ layers, panels, hashPrefix = 'lens' }: Props) {
  const uid = useId();
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'deeper' | 'shallower'>('deeper');
  const last = layers.length - 1;

  const select = useCallback(
    (next: number, opts: { focusTab?: boolean; scroll?: boolean } = {}) => {
      const clamped = Math.max(0, Math.min(last, next));
      if (clamped !== index) setDirection(clamped > index ? 'deeper' : 'shallower');
      setIndex(clamped);
      try {
        history.replaceState(null, '', `#${hashPrefix}-${layers[clamped].id}`);
      } catch {
        /* history can be unavailable in sandboxed previews */
      }
      if (opts.focusTab) tabRefs.current[clamped]?.focus();
      if (opts.scroll && rootRef.current && rootRef.current.getBoundingClientRect().top < 0) {
        rootRef.current.scrollIntoView({ block: 'start' });
      }
    },
    [hashPrefix, index, last, layers],
  );

  // Deep links: #lens-firmware opens that layer.
  useEffect(() => {
    const fromHash = () => {
      const match = window.location.hash.match(new RegExp(`^#${hashPrefix}-(.+)$`));
      if (!match) return;
      const i = layers.findIndex((l) => l.id === match[1]);
      if (i >= 0) {
        setIndex(i);
        rootRef.current?.scrollIntoView({ block: 'start' });
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [hashPrefix, layers]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: last,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], { focusTab: true });
    }
  };

  const active = layers[index];
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = (i: number) => `${uid}-panel-${i}`;

  return (
    <section
      ref={rootRef}
      aria-label="Abstraction lens"
      className="grid grid-cols-1 gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-10"
      style={{ scrollMarginTop: 'calc(var(--header-h) + 0.5rem)' }}
    >
      {/* ── Control column ── */}
      <div className="sticky top-[var(--header-h)] z-20 -mx-4 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur lg:top-[calc(var(--header-h)+1.5rem)] lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mb-3 hidden items-center justify-between lg:flex">
          <p className="eyebrow">Abstraction lens</p>
          <p className="font-mono text-[0.7rem] text-dim">
            L{index}/{last}
          </p>
        </div>

        <AbstractionControl
          className="mb-5 hidden lg:block"
          count={layers.length}
          index={index}
          valueText={`${active.label} layer`}
          onChange={(i) => select(i)}
        />

        <div
          role="tablist"
          aria-label="System layers"
          aria-orientation="vertical"
          className="relative flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible"
        >
          {/* depth rail */}
          <span aria-hidden className="absolute bottom-4 left-[0.95rem] top-4 hidden w-px bg-line lg:block" />
          {layers.map((layer, i) => {
            const state = i === index ? 'active' : i < index ? 'above' : 'below';
            return (
              <button
                key={layer.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={tabId(i)}
                role="tab"
                type="button"
                aria-selected={i === index}
                aria-controls={panelId(i)}
                tabIndex={i === index ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={onTabKey}
                className={cn(
                  'group relative flex min-h-11 shrink-0 items-center gap-3 rounded-md px-2.5 text-left transition-colors duration-150',
                  'lg:min-h-0 lg:py-2.5',
                  state === 'active' && 'bg-accent/10 lg:bg-transparent',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'relative z-10 hidden h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-200 lg:block',
                    state === 'active' && 'border-accent bg-accent shadow-[0_0_0_4px_rgb(var(--accent)/0.15)]',
                    state === 'above' && 'border-line-strong bg-line-strong',
                    state === 'below' && 'border-line-strong bg-bg',
                  )}
                />
                <span className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      'font-mono text-[0.68rem] transition-colors',
                      state === 'active' ? 'text-accent' : 'text-dim',
                    )}
                  >
                    L{i}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-xs uppercase tracking-[0.14em] transition-colors',
                      state === 'active' && 'text-fg',
                      state === 'above' && 'text-muted',
                      state === 'below' && 'text-dim group-hover:text-muted',
                    )}
                  >
                    {layer.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 hidden text-xs leading-relaxed text-dim lg:block">
          Turn the dial, scroll over it, or use the arrow keys to go deeper.
        </p>
      </div>

      {/* ── Panels ── */}
      <div className="min-w-0">
        {layers.map((layer, i) => (
          <div
            key={layer.id}
            id={panelId(i)}
            role="tabpanel"
            aria-labelledby={tabId(i)}
            tabIndex={0}
            hidden={i !== index}
            className={cn(
              'focus-visible:outline-offset-8',
              i === index && (direction === 'deeper' ? 'animate-layer-deeper' : 'animate-layer-shallower'),
            )}
          >
            <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="font-mono text-xs text-dim">
                  L{i} <span className="text-line-strong">/</span>{' '}
                  <span className="uppercase tracking-[0.14em] text-accent">{layer.label}</span>
                </p>
                {layer.caption && <h3 className="mt-1 text-xl font-semibold text-fg md:text-2xl">{layer.caption}</h3>}
              </div>
              <DepthMeter count={layers.length} index={i} />
            </header>

            {panels[i]}

            <nav aria-label="Layer navigation" className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-5">
              {i > 0 ? (
                <button type="button" onClick={() => select(i - 1, { scroll: true })} className="group min-h-11 text-left">
                  <span className="label block">Up a layer</span>
                  <span className="font-mono text-sm text-muted group-hover:text-fg">← {layers[i - 1].label}</span>
                </button>
              ) : (
                <span />
              )}
              {i < last ? (
                <button type="button" onClick={() => select(i + 1, { scroll: true })} className="group min-h-11 text-right">
                  <span className="label block">Go deeper</span>
                  <span className="font-mono text-sm text-accent group-hover:text-accent-strong">
                    {layers[i + 1].label} →
                  </span>
                </button>
              ) : (
                <span className="font-mono text-xs text-dim">Deepest layer</span>
              )}
            </nav>
          </div>
        ))}
      </div>
    </section>
  );
}

function DepthMeter({ count, index }: { count: number; index: number }) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 w-5 rounded-full',
            i < index && 'bg-line-strong',
            i === index && 'bg-accent',
            i > index && 'bg-line',
          )}
        />
      ))}
    </div>
  );
}
