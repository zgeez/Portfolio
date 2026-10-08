import { asset } from '@/data/site';
import { stm32Timing } from '@/data/stm32-msi';
import { Callout, MetricGrid } from '@/components/portfolio/ui';
import { SignalExplorer } from './signal-explorer';
import { HardFaultEasterEgg } from './hardfault-easter-egg';

export function SignalsLayer() {
  return (
    <HardFaultEasterEgg>
      <div className="space-y-8">
        <p className="max-w-3xl text-muted">
          Each stream reports where its own window begins relative to the shared start, and the application draws both
          against one axis with zero at the trigger. Only one stream holds the trigger; the other free-runs and is
          placed by index. Where the two windows do not overlap, the display says so.
        </p>

        <SignalExplorer
          src={asset('assets/stm32-msi/mixed_capture.png')}
          alt="Mixed capture view: a sine on analog channel CH1 plotted above eight logic traces D0 to D7, both against time from trigger in microseconds, with a timeline table reporting the analog stream at 1.000 MS/s covering −249.14 to +261.86 microseconds and the digital stream at 9.882 MS/s covering −207.24 to +207.14 microseconds"
          width={2450}
          height={1575}
        />

        <MetricGrid
          metrics={[
            { value: '−120 ns', label: 'measured analog/digital skew' },
            { value: `${stm32Timing.apertureNs} ns`, label: 'ADC sample-and-hold aperture' },
            { value: `${stm32Timing.logicPeriodNs} ns`, label: 'logic sample period', detail: '1 / 9.882 MS/s' },
            { value: '1 µs', label: 'scope sample period', detail: '1 / 1.000 MS/s' },
          ]}
        />

        <div id="postmortem-sync-skew" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <Callout tone="warning" title="A shared start is not a shared sampling instant">
            <p>
              Measured skew between the two paths is <strong className="text-fg">−120 ns</strong>. That figure is not
              noise and it is not a defect: it matches the ADC’s 143 ns sample-and-hold aperture, so the number was
              traced to a specific mechanism rather than left as a residual.
            </p>
            <p className="mt-3">
              No jitter is resolvable above the sampling quantization. The skew is measured against the device’s own
              reference output, which shares the sampler’s clock, so it bounds the two acquisition paths against each
              other rather than against an independent time base.
            </p>
          </Callout>
          <TimingDiagram />
        </div>
      </div>
    </HardFaultEasterEgg>
  );
}

/** Magnitudes only. It does not encode which path leads, and it is not a capture. */
function TimingDiagram() {
  const x0 = 120;
  const pxPerNs = 1.45;
  const at = (ns: number) => x0 + ns * pxPerNs;
  const logicTicks = [0, 1, 2].map((k) => k * stm32Timing.logicPeriodNs);
  return (
    <figure className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <p className="label">Timing near the shared start</p>
        <span className="tag-illustrative">Illustrative timing diagram</span>
      </div>
      <div className="overflow-x-auto p-4">
        <svg viewBox="0 0 580 210" className="h-auto w-full min-w-[460px]" role="img" aria-label="Illustrative timing: a shared start edge, logic samples every 101.2 nanoseconds, a 143 nanosecond ADC sample-and-hold aperture, and the measured 120 nanosecond skew magnitude.">
          {/* row labels */}
          {['SHARED START', 'LOGIC SAMPLES', 'ADC APERTURE'].map((t, i) => (
            <text key={t} x={0} y={38 + i * 48} className="fill-dim font-mono text-[10px]">
              {t}
            </text>
          ))}
          {/* start edge */}
          <path d={`M ${x0 - 30} 42 H ${x0} V 22 H 560`} className="fill-none stroke-muted" strokeWidth={1.5} />
          <line x1={x0} x2={x0} y1={18} y2={170} className="stroke-muted" strokeDasharray="3 3" />
          <text x={x0 + 5} y={16} className="fill-muted font-mono text-[10px]">
            TIM1 TRGO → TIM2
          </text>
          {/* logic sample ticks */}
          <line x1={x0 - 30} x2={560} y1={86} y2={86} className="stroke-line" />
          {logicTicks.map((ns) => (
            <g key={ns}>
              <line x1={at(ns)} x2={at(ns)} y1={74} y2={86} className="stroke-accent-blue" strokeWidth={2} />
              <text x={at(ns)} y={100} textAnchor="middle" className="fill-dim font-mono text-[9px]">
                {ns.toFixed(0)}
              </text>
            </g>
          ))}
          {/* ADC aperture */}
          <rect x={at(0)} y={118} width={stm32Timing.apertureNs * pxPerNs} height={18} rx={2} className="fill-warning/15 stroke-warning/70" />
          <text x={at(stm32Timing.apertureNs / 2)} y={131} textAnchor="middle" className="fill-warning font-mono text-[10px]">
            143 ns aperture
          </text>
          {/* skew magnitude bracket */}
          <path d={`M ${at(0)} 160 V 166 H ${at(120)} V 160`} className="fill-none stroke-accent" strokeWidth={1.5} />
          <text x={at(60)} y={184} textAnchor="middle" className="fill-accent font-mono text-[10.5px]">
            |skew| = 120 ns measured
          </text>
          <text x={560} y={204} textAnchor="end" className="fill-dim font-mono text-[9px]">
            ns from shared start
          </text>
        </svg>
      </div>
      <figcaption className="border-t border-line px-4 py-3 text-xs text-dim">
        Drawn to scale for magnitudes only; it does not encode which path leads. GPIO reads land when DMA wins the bus
        rather than exactly at the timer edge.
      </figcaption>
    </figure>
  );
}
