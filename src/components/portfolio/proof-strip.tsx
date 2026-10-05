import Link from 'next/link';
import { stm32Metrics } from '@/data/stm32-msi';
import { eegHeroMetrics } from '@/data/eeg';
import { waypointHeroMetrics } from '@/data/waypoint';
import { getProject } from '@/data/projects';

const PROOF = [
  { value: stm32Metrics.logicRate.value, label: 'Mixed-signal capture', detail: 'Logic path · measured rate', source: 'STM32 instrument', project: 'stm32-mixed-signal-instrument', anchor: 'measurements' },
  { value: eegHeroMetrics[0].value, label: 'EEG block accuracy', detail: 'Rest vs. task · mental-math model', source: 'EEG research', project: 'eeg-acquisition-neurofeedback-system', anchor: 'lens-classification' },
  { value: waypointHeroMetrics[0].value, label: 'Waypoint heading deviation', detail: 'Reported result · BNO08x', source: 'Waypoint compass', project: 'led-waypoint-compass', anchor: 'lens-navigation' },
  { value: getProject('electromagnetic-kinetic-7-segment-display')!.metrics![0].value, label: 'Kinetic display average power', detail: 'Estimated · 8 pulses / min', source: 'Kinetic display', project: 'electromagnetic-kinetic-7-segment-display', anchor: 'lens-energy' },
];

export function ProofStrip() {
  return (
    <section aria-label="Engineering results across four projects" className="border-b border-line bg-bg-elevated">
      <dl className="container grid grid-cols-2 lg:grid-cols-4">
        {PROOF.map((p, i) => (
          <div
            key={p.value}
            className={[
              'flex flex-col gap-1 py-6 lg:py-8',
              i % 2 === 1 ? 'pl-5 lg:pl-8' : 'pr-5 lg:pr-8',
              i > 0 ? 'lg:border-l lg:border-line lg:pl-8' : '',
              i % 2 === 1 ? 'border-l border-line' : '',
              i >= 2 ? 'border-t border-line lg:border-t-0' : '',
            ].join(' ')}
          >
            <dt className="order-2 text-sm text-muted">{p.label}</dt>
            <dd className="order-1 font-mono text-xl font-medium text-fg sm:text-2xl lg:text-3xl">{p.value}</dd>
            <dd className="order-3 text-xs text-dim">{p.detail}</dd>
            <dd className="order-4 mt-1">
              <Link href={`/projects/${p.project}/#${p.anchor}`} className="inline-flex min-h-11 items-center font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent hover:text-accent-strong" aria-label={`Evidence for ${p.label.toLowerCase()}: ${p.source}`}>
                {p.source} ↗
              </Link>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
