import Link from 'next/link';
import { ArrowDown, Github, Linkedin } from 'lucide-react';
import { site } from '@/data/site';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_40%,black,transparent)]"
      />
      <div className="container relative grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-28">
        <div>
          <p className="eyebrow">{site.role}</p>
          <h1 id="hero-title" className="mt-4 text-5xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl">
            {site.name}
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted sm:text-2xl">{site.tagline}</p>
          <p className="mt-6 font-mono text-sm text-dim">
            {site.stack.map((s, i) => (
              <span key={s}>
                {i > 0 && (
                  <>
                    {' '}
                    <span aria-hidden className="mx-1 text-line-strong">·</span>{' '}
                  </>
                )}
                <span className="whitespace-nowrap text-muted">{s}</span>
              </span>
            ))}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/#systems"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-5 font-medium text-bg transition-colors hover:bg-accent-strong"
            >
              Explore Systems
              <ArrowDown className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-md border border-line-strong px-5 font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent"
            >
              Resume
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex h-12 w-12 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
            >
              <Github className="h-5 w-5" aria-hidden />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex h-12 w-12 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
            >
              <Linkedin className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>
        <HeroSystemSketch />
      </div>
    </section>
  );
}

const LAYERS = ['PRODUCT', 'SYSTEM', 'FIRMWARE', 'HARDWARE', 'SIGNALS'];
const ROW = [36, 116, 196, 276, 356];

/** Static system sketch of the STM32 instrument; it previews the abstraction lens. */
function HeroSystemSketch() {
  return (
    <Link
      href="/projects/stm32-mixed-signal-instrument/#lens-system"
      aria-label="STM32 Mixed-Signal Instrument: explore its layers"
      className="group relative block rounded-xl border border-line bg-bg-elevated/70 p-4 transition-colors duration-200 hover:border-accent/40 sm:p-5"
    >
      <svg viewBox="0 0 500 410" className="h-auto w-full" aria-hidden>
        {/* layer planes */}
        {LAYERS.map((l, i) => (
          <g key={l}>
            <line x1={92} x2={496} y1={ROW[i] + 32} y2={ROW[i] + 32} className="stroke-line" strokeDasharray="2 6" />
            <text x={0} y={ROW[i] + 6} className="fill-dim font-mono text-[10px] tracking-[0.12em]">
              L{i}
            </text>
            <text x={0} y={ROW[i] + 20} className="fill-dim font-mono text-[9px] tracking-[0.12em] transition-colors group-hover:fill-muted">
              {l}
            </text>
          </g>
        ))}

        {/* L0 product shell */}
        <rect x={140} y={ROW[0] - 18} width={316} height={40} rx={8} className="fill-panel stroke-accent/60" />
        <text x={298} y={ROW[0] + 6} textAnchor="middle" className="fill-fg text-[14px] font-medium">
          Mixed-Signal Instrument
        </text>

        {/* L1 system */}
        <rect x={110} y={ROW[1] - 16} width={120} height={36} rx={6} className="fill-panel-2 stroke-line-strong" />
        <text x={170} y={ROW[1] + 6} textAnchor="middle" className="fill-fg font-mono text-[11px]">
          PC APP
        </text>
        <path d={`M230 ${ROW[1] + 2} H330`} className="stroke-line-strong" />
        <path d={`M230 ${ROW[1] + 2} H330`} className="trace-flow fill-none stroke-accent" strokeWidth={1.5} />
        <text x={280} y={ROW[1] - 6} textAnchor="middle" className="fill-accent-blue font-mono text-[10px]">
          USB CDC
        </text>
        <rect x={330} y={ROW[1] - 16} width={150} height={36} rx={6} className="fill-panel-2 stroke-accent/50" />
        <text x={405} y={ROW[1] + 6} textAnchor="middle" className="fill-fg font-mono text-[11px]">
          STM32F407
        </text>

        {/* L2 firmware */}
        <path d={`M405 ${ROW[1] + 20} V${ROW[2] - 22}`} className="stroke-line-strong" />
        {['REFILL', 'ACQ', 'USB CTRL', 'STATUS'].map((t, i) => (
          <g key={t}>
            <rect x={110 + i * 94} y={ROW[2] - 16} width={84} height={30} rx={5} className="fill-panel stroke-line" />
            <text x={152 + i * 94} y={ROW[2] + 3} textAnchor="middle" className="fill-muted font-mono text-[9.5px]">
              {t}
            </text>
          </g>
        ))}

        {/* L3 hardware */}
        {['AWG', 'SCOPE', 'LOGIC'].map((t, i) => (
          <g key={t}>
            <path d={`M${152 + i * 125} ${ROW[2] + 14} V${ROW[3] - 16}`} className="stroke-line" />
            <rect x={110 + i * 125} y={ROW[3] - 16} width={95} height={34} rx={5} className="fill-panel-2 stroke-line-strong" />
            <text x={157 + i * 125} y={ROW[3] + 5} textAnchor="middle" className="fill-fg font-mono text-[11px]">
              {t}
            </text>
          </g>
        ))}

        {/* L4 signals: decorative sketch, not data */}
        <path
          d={`M110 ${ROW[4] - 2} ${Array.from({ length: 40 }, (_, i) => {
            const x = 110 + i * 9.5;
            const y = ROW[4] - 2 - 13 * Math.sin((i / 39) * Math.PI * 4);
            return `L${x.toFixed(1)} ${y.toFixed(1)}`;
          }).join(' ')}`}
          className="fill-none stroke-warning/80"
          strokeWidth={1.5}
        />
        <path
          d={`M110 ${ROW[4] + 16} H202.6 V${ROW[4] + 28} H295.3 V${ROW[4] + 16} H387.9 V${ROW[4] + 28} H480.5`}
          className="fill-none stroke-accent-blue/80"
          strokeWidth={1.5}
        />
        <line x1={295.3} x2={295.3} y1={ROW[4] - 22} y2={ROW[4] + 34} className="stroke-muted" strokeDasharray="3 3" />
      </svg>
      <div className="mt-2 flex items-center justify-between gap-3 border-t border-line pt-3">
        <p className="font-mono text-[0.7rem] text-dim">System sketch · STM32 Mixed-Signal Instrument</p>
        <p className="font-mono text-[0.7rem] text-accent transition-transform group-hover:translate-x-0.5">Peel it apart →</p>
      </div>
    </Link>
  );
}
