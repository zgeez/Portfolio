'use client';

import { useMemo, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

export type ProbeNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  variant?: 'core' | 'link';
  probe: { title: string; items: string[] };
};

export type ProbeEdge = {
  id: string;
  from: string;
  to: string;
  /** SVG path in viewBox units. */
  d: string;
  label?: string;
  lx?: number;
  ly?: number;
  /** Data moves along this edge: draws travelling dashes. */
  flow?: boolean;
};

export type ProbeDiagramData = {
  viewBox: string;
  title: string;
  nodes: ProbeNode[];
  edges: ProbeEdge[];
  annotations?: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end' }[];
};

type Props = {
  data: ProbeDiagramData;
  /** Minimum rendered width before the diagram scrolls horizontally on phones. */
  minWidth?: number;
  className?: string;
};

/**
 * "Probe the system": hover, focus or tap a block to read its verified details.
 * Click/Enter locks the selection until another block, the background or Escape.
 */
export function ProbeDiagram({ data, minWidth = 540, className }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(() => data.nodes.find(node => node.variant === 'core')?.id ?? data.nodes[0]?.id ?? null);
  const activeId = hovered ?? locked;
  const active = data.nodes.find((n) => n.id === activeId) ?? null;

  const connected = useMemo(() => {
    if (!activeId) return null;
    const nodes = new Set([activeId]);
    const edges = new Set<string>();
    for (const e of data.edges) {
      if (e.from === activeId || e.to === activeId) {
        edges.add(e.id);
        nodes.add(e.from);
        nodes.add(e.to);
      }
    }
    return { nodes, edges };
  }, [activeId, data.edges]);

  const toggle = (id: string) => setLocked((cur) => (cur === id ? null : id));

  const onNodeKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(id);
    } else if (e.key === 'Escape') {
      setLocked(null);
      setHovered(null);
    }
  };

  return (
    <div className={cn('dossier-probe', className)}>
      <div className="dossier-probe-canvas panel grid-bg overflow-x-auto p-3 sm:p-4">
        <svg
          viewBox={data.viewBox}
          role="group"
          aria-label={`${data.title}. Select a block to read its details.`}
          className="h-auto w-full"
          style={{ minWidth }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLocked(null);
          }}
        >
          {data.edges.map((edge) => {
            const on = connected?.edges.has(edge.id);
            const dim = connected && !on;
            return (
              <g key={edge.id} aria-hidden className={cn('transition-opacity duration-200', dim && 'opacity-30')}>
                <path
                  d={edge.d}
                  className={cn('fill-none transition-colors duration-200', on ? 'stroke-accent' : 'stroke-line-strong')}
                  strokeWidth={on ? 1.75 : 1.25}
                />
                {edge.flow && (
                  <path
                    d={edge.d}
                    className={cn('trace-flow fill-none', on ? 'stroke-accent-strong' : 'stroke-accent/40')}
                    strokeWidth={1.75}
                  />
                )}
                {edge.label && edge.lx !== undefined && edge.ly !== undefined && (
                  <text x={edge.lx} y={edge.ly} textAnchor="middle" className="fill-muted font-mono text-[10px]">
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {data.annotations?.map((a) => (
            <text
              key={a.text}
              x={a.x}
              y={a.y}
              textAnchor={a.anchor ?? 'start'}
              className="pointer-events-none fill-dim font-mono text-[10px]"
              aria-hidden
            >
              {a.text}
            </text>
          ))}

          {data.nodes.map((node) => {
            const isActive = node.id === activeId;
            const isLocked = node.id === locked;
            const dim = connected && !connected.nodes.has(node.id);
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-pressed={isLocked}
                aria-label={`${node.label}${node.sub ? `, ${node.sub}` : ''}: show details`}
                className={cn(
                  'cursor-pointer outline-none transition-opacity duration-200 [&:focus-visible>rect]:stroke-accent [&:focus-visible>rect]:[stroke-width:2.5]',
                  dim && 'opacity-45',
                )}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(node.id)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(null)}
                onFocus={(e) => e.currentTarget.matches(':focus-visible') && setHovered(node.id)}
                onBlur={() => setHovered(null)}
                onClick={() => toggle(node.id)}
                onKeyDown={(e) => onNodeKey(e, node.id)}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={6}
                  strokeDasharray={node.variant === 'link' ? '4 3' : undefined}
                  className={cn(
                    'transition-all duration-200',
                    isActive
                      ? 'fill-accent/10 stroke-accent [filter:drop-shadow(0_0_6px_rgb(var(--accent)/0.35))]'
                      : node.variant === 'core'
                        ? 'fill-panel-2 stroke-accent/50'
                        : node.variant === 'link'
                          ? 'fill-panel stroke-accent-blue/60'
                          : 'fill-panel-2 stroke-line-strong',
                  )}
                  strokeWidth={isActive ? 1.75 : 1.25}
                />
                <text
                  x={node.x + node.w / 2}
                  y={node.y + (node.sub ? node.h / 2 - 3 : node.h / 2 + 5)}
                  textAnchor="middle"
                  className="pointer-events-none fill-fg text-[14px] font-medium"
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={node.x + node.w / 2}
                    y={node.y + node.h / 2 + 14}
                    textAnchor="middle"
                    className="pointer-events-none fill-muted font-mono text-[10.5px]"
                  >
                    {node.sub}
                  </text>
                )}
                {isLocked && (
                  <circle cx={node.x + node.w - 8} cy={node.y + 8} r={3} className="fill-accent" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <aside aria-live="polite" className="dossier-probe-detail min-h-[9rem]">
        {active ? (
          <div key={active.id} className="animate-fade-in">
            <p className="label flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              Selected component · {locked === active.id ? 'locked' : 'preview'}
            </p>
            <h4 className="mt-2 font-semibold text-fg">{active.probe.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {active.probe.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-px w-2.5 shrink-0 bg-accent/60" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p className="label">Probe</p>
            <p className="mt-2 text-sm text-muted">
              Hover or focus a block to preview it. Select a block to keep its details open.
            </p>
          </div>
        )}
        <div className="dossier-probe-selectors" aria-label="Choose a component">{data.nodes.map(node => <button key={node.id} type="button" className="chip hover:border-accent/50 hover:text-fg" aria-pressed={locked === node.id} onClick={() => { setHovered(null); setLocked(node.id); }}>{node.label}</button>)}</div>
        <noscript><div className="mt-5 space-y-3">{data.nodes.map(node => <details key={node.id}><summary>{node.probe.title}</summary><ul className="mt-2 space-y-2 text-sm text-muted">{node.probe.items.map(item => <li key={item}>{item}</li>)}</ul></details>)}</div></noscript>
      </aside>
    </div>
  );
}
