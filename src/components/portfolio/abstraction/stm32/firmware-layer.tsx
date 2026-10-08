import { stm32BoardChecks, stm32LatencyBug, stm32Metrics, stm32Tasks } from '@/data/stm32-msi';
import { Bullets, Callout, DataTable, DebugSteps } from '@/components/portfolio/ui';
import { LatencyFixDiagram } from './latency-fix-diagram';

const WAKE_SOURCES: Record<string, string> = {
  refill: 'DAC circular DMA',
  acquisition: 'ADC or GPIO DMA',
  control: 'CDC callbacks → notify',
  status: '—',
};

export function FirmwareLayer() {
  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-muted">
        Bare-metal C with FreeRTOS. Waveform refill, acquisition, USB control and status are separated into their own
        tasks, coordinating four concurrent DMA streams across the DAC, dual ADC and GPIO sampling.
      </p>

      {/* Task board */}
      <section aria-labelledby="fw-tasks">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h4 id="fw-tasks" className="font-semibold text-fg">
            Four tasks, four responsibilities
          </h4>
          <span className="tag-illustrative">Architecture view · not a measured RTOS trace</span>
        </div>
        <div className="panel divide-y divide-line">
          {stm32Tasks.map((task, i) => (
            <div key={task.id} className="grid gap-3 p-4 md:grid-cols-[11rem_9.5rem_1fr] md:items-start">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-dim">T{i}</span>
                <span className="font-mono text-sm text-fg">{task.name}</span>
              </div>
              <div className="font-mono text-[0.7rem] text-dim">
                <span className="text-dim">fed by </span>
                <span className={task.id === 'control' ? 'text-accent' : 'text-muted'}>{WAKE_SOURCES[task.id]}</span>
              </div>
              <Bullets items={task.items} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-dim">
          Responsibilities as documented in the project write-up. Priorities, stack sizes and periods are deliberately
          not shown.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* DMA */}
        <section className="panel p-5">
          <p className="label">DMA</p>
          <p className="mt-2 font-mono text-3xl text-fg">{stm32Metrics.dma.value}</p>
          <p className="text-sm text-muted">concurrent streams</p>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {Array.from({ length: Number(stm32Metrics.dma.value) }, (_, i) => (
              <span key={i} className="h-6 flex-1 rounded-sm border border-accent/40 bg-accent/10" />
            ))}
          </div>
          <p className="mt-3 text-xs text-dim">Shared across DAC, dual ADC and GPIO sampling. Per-stream mapping intentionally omitted.</p>
        </section>

        {/* Protocol */}
        <section className="panel p-5">
          <p className="label">Protocol</p>
          <div className="mt-3 flex items-stretch gap-1 font-mono text-[0.7rem]" aria-label="A frame is a COBS-encoded payload followed by a zero delimiter">
            <span className="flex-1 rounded-sm border border-accent-blue/40 bg-accent-blue/10 px-2 py-2 text-center text-accent-blue">
              COBS(payload)
            </span>
            <span className="rounded-sm border border-line-strong px-2 py-2 text-muted">0x00</span>
          </div>
          <Bullets
            className="mt-4"
            items={[
              'Versioned binary protocol, 28 commands',
              'COBS framing: zero appears only as the frame delimiter',
              'Version mismatch named, not guessed at',
            ]}
          />
        </section>

        {/* Faults */}
        <section className="panel p-5">
          <p className="label">Fail loudly</p>
          <p className="mt-2 text-sm text-muted">
            A waveform refill that misses its half <span className="text-fg">faults and stops the timer</span> rather
            than repeating stale samples, so a missed deadline is reported instead of quietly producing a wrong
            waveform.
          </p>
          <p className="label mt-4">Board checks</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {stm32BoardChecks.map((c) => (
              <li key={c} className="chip">
                {c}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Debug story */}
      <section id="postmortem-usb-latency" aria-labelledby="fw-debug" className="space-y-5">
        <div>
          <p className="eyebrow text-warning">Debug log · postmortem</p>
          <h4 id="fw-debug" className="mt-1 text-xl font-semibold text-fg">
            {stm32LatencyBug.title}
          </h4>
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="panel p-5">
            <DebugSteps
              steps={stm32LatencyBug.steps.map((s) => ({
                stage: s.stage,
                text:
                  'code' in s && s.code ? (
                    <>
                      <code className="font-mono text-[0.85em] text-accent-strong">{s.code}</code>
                      {s.text.slice(s.code.length)}
                    </>
                  ) : (
                    s.text
                  ),
              }))}
            />
          </div>
          <div className="space-y-4">
            <LatencyFixDiagram />
            <DataTable
              head={['Measurement', 'Before', 'After', 'Change']}
              rows={stm32LatencyBug.table.map((r) => [
                r.measurement,
                <span key="b" className="font-mono">{r.before}</span>,
                <span key="a" className="font-mono text-accent">{r.after}</span>,
                <span key="c" className="font-mono">{r.change}</span>,
              ])}
            />
          </div>
        </div>
        <Callout>{stm32LatencyBug.note}</Callout>
      </section>
    </div>
  );
}
