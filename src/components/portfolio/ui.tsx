import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EvidenceFigure, type EvidenceFigureProps } from '@/components/projects/evidence-figure';

export function MetricGrid({
  metrics,
  className,
  size = 'md',
}: {
  metrics: readonly { value: string; label: string; detail?: string }[];
  className?: string;
  size?: 'md' | 'lg';
}) {
  return (
    <dl className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4', className)}>
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col bg-panel px-4 py-4">
          <dt className="order-2 mt-1 text-xs text-muted">{m.label}</dt>
          <dd className={cn('order-1 font-mono font-medium tracking-tight text-fg', size === 'lg' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl')}>
            {m.value}
          </dd>
          {m.detail && <dd className="order-3 mt-0.5 font-mono text-[0.68rem] text-dim">{m.detail}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function Figure(props: EvidenceFigureProps) {
  return <EvidenceFigure {...props} />;
}

/** A phone screenshot in a minimal device frame. */
export function PhoneShot({
  src,
  alt,
  caption,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <EvidenceFigure src={src} alt={alt} width={width} height={height} caption={caption} kind="Screenshot" className={cn('dossier-phone-shot w-full max-w-[220px]', className)} />
  );
}

export function Callout({
  tone = 'note',
  title,
  children,
  className,
}: {
  tone?: 'note' | 'warning' | 'accent';
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'rounded-lg border p-4 text-sm leading-relaxed md:p-5',
        tone === 'warning' && 'border-warning/35 bg-warning/[0.05] text-muted',
        tone === 'accent' && 'border-accent/35 bg-accent/[0.05] text-muted',
        tone === 'note' && 'border-line bg-panel text-muted',
        className,
      )}
    >
      {title && (
        <p
          className={cn(
            'mb-2 font-mono text-xs uppercase tracking-[0.14em]',
            tone === 'warning' ? 'text-warning' : tone === 'accent' ? 'text-accent' : 'text-fg',
          )}
        >
          {title}
        </p>
      )}
      {children}
    </aside>
  );
}

export function Chips({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn('inline-flex items-center gap-1 link-accent', className)}>
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function Bullets({ items, className }: { items: readonly ReactNode[]; className?: string }) {
  return (
    <ul className={cn('space-y-2 text-sm text-muted', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-[0.6rem] h-px w-2.5 shrink-0 bg-accent/60" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type DebugStep = { stage: string; text: ReactNode };

/** symptom → observation → hypothesis → root cause → fix → result */
export function DebugSteps({ steps, compact }: { steps: readonly DebugStep[]; compact?: boolean }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={s.stage} className={cn('relative grid grid-cols-[6.5rem_1fr] gap-3 sm:grid-cols-[8rem_1fr]', compact ? 'pb-3' : 'pb-4')}>
            {!last && <span aria-hidden className="absolute bottom-0 left-[0.3rem] top-5 w-px bg-line" />}
            <span className="relative flex items-start gap-2.5 pt-0.5">
              <span
                aria-hidden
                className={cn(
                  'mt-1 h-2.5 w-2.5 shrink-0 rounded-full border',
                  last ? 'border-accent bg-accent' : s.stage === 'Root cause' ? 'border-warning bg-warning/30' : 'border-line-strong bg-bg',
                )}
              />
              <span className={cn('font-mono text-[0.68rem] uppercase tracking-[0.12em]', last ? 'text-accent' : s.stage === 'Root cause' ? 'text-warning' : 'text-dim')}>
                {s.stage}
              </span>
            </span>
            <span className={cn('text-sm', last ? 'text-fg' : 'text-muted')}>{s.text}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function DataTable({
  head,
  rows,
  className,
}: {
  head: readonly string[];
  rows: readonly (readonly ReactNode[])[];
  className?: string;
}) {
  return (
    <div className={cn('dossier-table overflow-x-auto rounded-lg border border-line', className)}>
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead className="bg-panel-2">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-dim">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i} className="bg-panel/40">
              {r.map((c, j) => (
                <td key={j} className={cn('px-4 py-2.5 align-top', j === 0 ? 'text-fg' : 'text-muted')}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
