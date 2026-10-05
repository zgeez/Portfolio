import { stm32Metrics } from '@/data/stm32-msi';

const PROOF = [
  { value: stm32Metrics.logicRate.value, label: 'logic capture', source: 'STM32 MSI' },
  { value: stm32Metrics.latency.value, label: 'median USB RTT', source: 'STM32 MSI' },
  { value: `${stm32Metrics.dma.value} DMA streams`, label: 'concurrent', source: 'STM32 MSI' },
  { value: '8-channel EEG', label: '24-bit @ 250 Hz', source: 'ADS1299 + ESP32-S3' },
];

export function ProofStrip() {
  return (
    <section aria-label="Measured results" className="border-b border-line bg-bg-elevated">
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
            <dd className="order-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-dim">{p.source}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
