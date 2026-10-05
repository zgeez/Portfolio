import { cn } from '@/lib/utils';

/** A 16-pixel NeoPixel ring; pixel 0 is the forward pixel at the top. */
export function LedRing({
  pixels,
  pulse,
  label,
  className,
}: {
  pixels: (string | null)[];
  pulse?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={cn(pulse && 'motion-safe:animate-pulse', className)} role="img" aria-label={label}>
      <circle cx={60} cy={60} r={57} className="fill-panel-2 stroke-line-strong" />
      <circle cx={60} cy={60} r={44} fill="none" className="stroke-bg" strokeWidth={15} />
      {pixels.map((color, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 16;
        const x = 60 + 44 * Math.cos(a);
        const y = 60 + 44 * Math.sin(a);
        return (
          <g key={i}>
            {color && <circle cx={x} cy={y} r={9} fill={color} opacity={0.3} />}
            <rect
              x={x - 4.5}
              y={y - 4.5}
              width={9}
              height={9}
              rx={1.5}
              className={color ? 'fill-fg' : 'fill-line'}
              transform={`rotate(${(i * 360) / 16} ${x} ${y})`}
            />
            <circle cx={x} cy={y} r={2.8} fill={color ?? 'rgb(var(--line-strong))'} />
          </g>
        );
      })}
      <text x={60} y={63} textAnchor="middle" className="fill-dim font-mono text-[8px]">
        ▲ fwd
      </text>
    </svg>
  );
}
