import { asset } from '@/data/site';
import { eegFilterChain, eegModels, eegMontage, eegRefs, eegRuns, eegSystemDiagram } from '@/data/eeg';
import { ProbeDiagram } from '@/components/portfolio/abstraction/probe-diagram';
import { Bullets, Callout, DataTable, Figure, MetricGrid } from '@/components/portfolio/ui';

const img = (name: string) => asset(`assets/eeg-neurofeedback/${name}`);

export function EegProductLayer() {
  return (
    <div className="space-y-8">
      <div className="dossier-split">
        <div className="space-y-4 text-muted">
          <p className="text-lg leading-relaxed text-fg">
            Can a locally processed, low-cost 8-channel EEG rig reliably separate rest from cognitive task?
          </p>
          <p>
            Sustained engagement is hard to measure in a classroom: the usual feedback is delayed, observational, and
            non-adaptive. Answering the narrower engineering question meant building the entire chain: analog front end,
            embedded firmware, acquisition software, labeled data collection, a supervised model, and a teacher-facing
            display.
          </p>
          <p>
            My role was software lead: the MATLAB acquisition and processing pipeline, ESP32-S3/ADS1299 firmware
            bring-up, the model training workflow, and dashboard integration.
          </p>
          <Callout tone="warning" title="Scope">
            An engineering proof-of-concept. It does not diagnose or treat any condition; its output is a Rest-vs-Task
            classification used as a cautious proxy for task engagement, not a measure of attention or ability.
          </Callout>
        </div>
        <Figure
          src={img('bench_setup.jpg')}
          alt="EEG bench setup with ADS1299EEG-FE front end, MMB0 motherboard, ESP32-S3 on a breadboard, and electrode leads"
          kind="Hardware photo"
          width={1200}
          height={1600}
          caption="Bench setup: ADS1299EEG-FE front end, MMB0 motherboard, ESP32-S3 SPI bridge, and electrode leads."
          className="mx-auto max-w-sm"
        />
      </div>
    </div>
  );
}

export function EegSystemLayer() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-muted">
        Every stage runs locally, so there is no cloud dependency in the demo workflow, which keeps sensitive EEG and
        session data on the machine that recorded it. Probe a stage for its details.
      </p>
      <ProbeDiagram data={eegSystemDiagram} />
    </div>
  );
}

export function EegAcquisitionLayer() {
  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-muted">
        Rather than use the stock DSP motherboard path, the TI ADS1299EEG-FE was brought up against an ESP32-S3 acting
        as SPI master: the MCU configures the channel registers, starts continuous conversion, reads each 27-byte frame
        on the <code className="font-mono text-accent-strong">DRDY</code> interrupt, and forwards framed binary packets
        over USB serial at 250 Hz.
      </p>

      <section aria-labelledby="eeg-frame" className="panel p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 id="eeg-frame" className="font-semibold text-fg">
            One ADS1299 frame, 27 bytes
          </h4>
          <p className="font-mono text-xs text-dim">read on every DRDY · 250 per second</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <div className="flex min-w-[36rem] gap-1 font-mono text-[0.68rem]" role="img" aria-label="Frame layout: a 3-byte status word followed by eight 3-byte signed channel samples">
            <div className="flex-[3] rounded-sm border border-warning/50 bg-warning/10 py-3 text-center text-warning">STATUS · 3 B</div>
            {eegMontage.map((m) => (
              <div key={m.ch} className="flex-[3] rounded-sm border border-accent-blue/40 bg-accent-blue/10 py-3 text-center text-accent-blue">
                {m.ch}
              </div>
            ))}
          </div>
          <p className="mt-2 font-mono text-[0.68rem] text-dim">status word + 8 × 24-bit signed samples</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel p-5">
          <p className="label">SPI bring-up</p>
          <Bullets
            className="mt-3"
            items={[
              'Register configuration for all 8 channels',
              'Gain, reference buffer, and bias-drive setup',
              <>
                <code className="font-mono text-accent-strong">RDATAC</code> continuous-read mode
              </>,
              'Clock/timing validation with logic analysis',
            ]}
          />
        </section>
        <section className="panel p-5">
          <p className="label">Streaming</p>
          <Bullets
            className="mt-3"
            items={[
              'DRDY-triggered frame capture',
              'Status word + 8 × 24-bit signed samples',
              'Framed binary packets over USB serial',
              'Drop counting for stream integrity',
            ]}
          />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <MontageHead />
        <div className="space-y-4 text-sm text-muted">
          <p>
            The prototype started as a single-channel setup with very limited spatial coverage. The final montage spans
            frontal, central, and parietal sites: enough coverage to separate executive-task activity from rest without
            making setup impractical for repeated sessions.
          </p>
          <Bullets
            items={[
              'F3 / Fz / F4: frontal and executive-task-related activity',
              'C3 / Cz / C4: central and sensorimotor rhythm activity',
              'P3 / P4: parietal task-state information for the classifier',
              'Fpz drives bias to reduce common-mode noise; TP8 references away from measurement sites',
            ]}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Figure src={img('ads1299_stack.jpg')} alt="ADS1299EEG-FE front-end board mated to the TI MMB0 modular EVM motherboard" width={1600} height={1200} caption="ADS1299EEG-FE on the MMB0, SPI header broken out." />
        <Figure src={img('ads1299_frontend.jpg')} alt="Close-up of the ADS1299 analog front end showing per-channel input headers and bias/reference pins" width={1600} height={1200} caption="Per-channel differential inputs plus BIAS and REF." />
        <Figure src={img('electrode_setup.jpg')} alt="Final 8-channel EEG electrode setup on a participant" width={1050} height={1400} caption="Final 8-channel head setup used for recording." imgClassName="aspect-[4/3] object-cover" />
      </div>
    </div>
  );
}

function MontageHead() {
  const R = 120;
  const C = 150;
  const pos = (x: number, y: number) => [C + x * R, C + y * R] as const;
  return (
    <figure className="panel p-4">
      <svg viewBox="0 0 300 300" className="mx-auto h-auto w-full max-w-xs" role="img" aria-label="Top-down 10–20 montage: channels 1 to 8 at F3, Fz, F4, C3, Cz, C4, P3, P4; bias at Fpz; reference at TP8.">
        <circle cx={C} cy={C} r={R} className="fill-panel-2 stroke-line-strong" />
        <path d={`M${C - 14} ${C - R + 2} L${C} ${C - R - 16} L${C + 14} ${C - R + 2}`} className="fill-panel-2 stroke-line-strong" />
        <line x1={C} x2={C} y1={C - R} y2={C + R} className="stroke-line" strokeDasharray="2 4" />
        <line x1={C - R} x2={C + R} y1={C} y2={C} className="stroke-line" strokeDasharray="2 4" />
        {eegRefs.map((r) => {
          const [x, y] = pos(r.x, r.y);
          return (
            <g key={r.site}>
              <rect x={x - 9} y={y - 9} width={18} height={18} rx={3} className="fill-bg stroke-warning" />
              <text x={x} y={y + 24} textAnchor="middle" className="fill-warning font-mono text-[9px]">
                {r.site} · {r.role}
              </text>
            </g>
          );
        })}
        {eegMontage.map((m) => {
          const [x, y] = pos(m.x, m.y);
          return (
            <g key={m.site}>
              <circle cx={x} cy={y} r={11} fill={m.color} fillOpacity={0.2} stroke={m.color} />
              <text x={x} y={y + 3.5} textAnchor="middle" className="fill-fg font-mono text-[9.5px] font-semibold">
                {m.site}
              </text>
              <text x={x} y={y + 24} textAnchor="middle" className="fill-dim font-mono text-[8.5px]">
                {m.ch}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-dim">Top-down view, nose up. Positions approximate the 10–20 system.</figcaption>
    </figure>
  );
}

export function EegProcessingLayer() {
  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-muted">
        MATLAB is the core of the workflow: it opens the serial port, parses the binary packets, converts raw counts to
        microvolts, applies the filter chain, computes spectral features, launches the cognitive tasks, writes
        synchronized markers, and logs every run to disk in a reproducible folder structure.
      </p>

      <ol className="flex flex-wrap items-stretch gap-2" aria-label="Processing chain">
        {eegFilterChain.map((s, i) => (
          <li key={s.stage} className="flex items-center gap-2">
            <div className="rounded-md border border-line bg-panel px-3 py-2">
              <p className="font-mono text-xs text-fg">{s.stage}</p>
              <p className="font-mono text-[0.68rem] text-dim">{s.detail}</p>
            </div>
            {i < eegFilterChain.length - 1 && (
              <span aria-hidden className="text-accent">
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      <Figure
        src={img('matlab_ui.webp')}
        alt="MATLAB acquisition interface showing raw EEG, filtered channels, Welch PSD, and model focus index"
        width={1600}
        height={1000}
        caption="Live acquisition UI: raw EEG, filtered stack (HP 0.2 → 59–61 Hz notch → BP 1–50), Welch PSD, and model focus index, with a mental-math task prompt running alongside."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Acquisition', ['Binary ADS1299 packet parsing', '250 Hz, 24-bit signed values', 'Counts → microvolts', 'Drop counting, stream health']],
          ['Processing', ['HP, mains notch, band-pass chain', 'Welch PSD per channel', 'δ / θ / α / β bandpower', 'Blink & motion artifact gating']],
          ['Visualization', ['Raw and filtered side by side', 'Single or stacked channels', 'Live PSD, selectable channel', 'Rolling focus-index trace']],
          ['Logging & tasks', ['Per-run CSV under logs/runs/', 'Synchronized task markers', 'Mental math, Stroop, Go/NoGo, task-switching', 'Per-run setup metadata']],
        ].map(([title, items]) => (
          <section key={title as string} className="panel p-5">
            <p className="label">{title as string}</p>
            <Bullets className="mt-3" items={items as string[]} />
          </section>
        ))}
      </div>

      <section id="postmortem-eeg-labels" aria-labelledby="eeg-markers" className="space-y-4">
        <h4 id="eeg-markers" className="font-semibold text-fg">
          Labels come from the task launcher
        </h4>
        <p className="max-w-3xl text-sm text-muted">
          Every recording alternates rest and task blocks, with markers written by the task launcher itself (Rest = 0,
          Task = 1). Marker alignment turned out to be one of the highest-leverage details in the project: misaligned
          blocks silently poison the training set.
        </p>
        <div className="panel p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="label">Block structure</p>
            <span className="tag-illustrative">Schematic</span>
          </div>
          <div className="mt-3 flex h-9 overflow-hidden rounded font-mono text-[0.68rem]" aria-hidden>
            {['REST · 0', 'TASK · 1', 'REST · 0', 'TASK · 1', 'REST · 0', 'TASK · 1'].map((b, i) => (
              <div key={i} className={`flex flex-1 items-center justify-center border-r border-bg ${i % 2 ? 'bg-accent/20 text-accent' : 'bg-panel-2 text-dim'}`}>
                {b}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="panel p-5">
            <p className="label">Recorded dataset</p>
            <p className="mt-2 text-sm text-muted">45 run folders under logs/runs; 33 completed runs with task result CSVs.</p>
            <ul className="mt-4 space-y-2">
              {eegRuns.map((r) => (
                <li key={r.task} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-sm">
                  <span className="text-muted">{r.task}</span>
                  <span className="h-2 rounded-full bg-line">
                    <span className="block h-2 rounded-full bg-accent/70" style={{ width: `${r.runs * 10}%` }} />
                  </span>
                  <span className="text-right font-mono text-xs text-fg">{r.runs}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[0.68rem] text-dim">completed 8-channel runs by paradigm</p>
          </div>
          <Callout title="Why it mattered">
            The jump from 70.0% to 82.9% block accuracy came from complete 8-channel recordings and stricter
            marker/artifact hygiene rather than from model complexity.
          </Callout>
        </div>
      </section>
    </div>
  );
}

export function EegClassificationLayer() {
  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-muted">
        A <strong className="text-fg">Random Forest</strong> over spectral features from 5-second windows with a
        2.5-second step. Each window contributes Welch-PSD-derived bandpower features across all eight channels;
        artifact and outlier rejection runs before inference. The model outputs{' '}
        <code className="font-mono text-accent-strong">P(Task)</code>, and a tuned threshold converts it into a
        Rest-vs-Task decision. Block accuracy aggregates window predictions across a full block.
      </p>

      <div className="panel p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="label">Windowing · 5 s windows, 2.5 s step</p>
          <span className="tag-illustrative">Schematic</span>
        </div>
        <svg viewBox="0 0 600 92" className="mt-3 h-auto w-full" aria-hidden>
          <line x1={10} x2={590} y1={80} y2={80} className="stroke-line-strong" />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <line x1={10 + i * 70} x2={10 + i * 70} y1={76} y2={84} className="stroke-line-strong" />
              <text x={10 + i * 70} y={92} textAnchor="middle" className="fill-dim font-mono text-[9px]">
                {(i * 2.5).toFixed(1)}s
              </text>
            </g>
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={10 + i * 70} y={6 + (i % 2) * 30} width={140} height={22} rx={3} className={i % 2 ? 'fill-accent-blue/15 stroke-accent-blue/60' : 'fill-accent/15 stroke-accent/60'} />
          ))}
        </svg>
      </div>

      <MetricGrid
        metrics={[
          { value: '82.9%', label: 'block accuracy', detail: 'best mental-math, 10 runs' },
          { value: '79.4%', label: 'block accuracy', detail: 'broad multi-task, 28 runs' },
          { value: '5 → 10', label: 'training runs', detail: 'mental math' },
          { value: '55.5 → 78.2', label: 'generalization score' },
        ]}
      />

      <DataTable
        head={['Model', 'Task(s)', 'Runs', 'Threshold', 'Segment acc.', 'Block acc.', 'Generalization']}
        rows={eegModels.map((m) => [
          m.model,
          m.tasks,
          <span key="r" className="font-mono">{m.runs}</span>,
          <span key="t" className="font-mono">{m.threshold}</span>,
          <span key="s" className="font-mono">{m.segment}</span>,
          <span key="b" className="font-mono text-accent">{m.block}</span>,
          <span key="g" className="font-mono">{m.gen}</span>,
        ])}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Figure src={img('model_initial.png')} alt="Evaluation plots for the initial 8-channel mental-math model" width={816} height={410} caption="Initial model: 5 runs, 70.0% block accuracy." />
        <Figure src={img('model_latest.png')} alt="Evaluation plots for the strongest 8-channel mental-math model" width={817} height={410} caption="Best model: 10 runs, 82.9% block accuracy." />
      </div>

      <section aria-labelledby="eeg-dash" className="space-y-4">
        <h4 id="eeg-dash" className="font-semibold text-fg">
          Teacher dashboard &amp; student view
        </h4>
        <p className="max-w-3xl text-sm text-muted">
          The Electron/React dashboard separates system controls from what a student sees: the teacher gets device
          state, engagement-proxy history, calibration, and session scripting; the student view shows only the current
          prompt.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Session modes', ['Live serial connection', 'Mock mode for demos', 'Replay of recorded runs']],
            ['Monitoring', ['Per-device status cards', 'Engagement-proxy history', 'Hardware validation checks']],
            ['Control', ['Calibration and scripted session context', 'Student display controls', 'Master audio control and CSV export']],
          ].map(([title, items]) => (
            <section key={title as string} className="panel p-5">
              <p className="label">{title as string}</p>
              <Bullets className="mt-3" items={items as string[]} />
            </section>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Figure src={img('teacher_view.png')} alt="Teacher dashboard with device cards, engagement-proxy history, and session controls" width={1600} height={955} caption="Teacher dashboard." />
          <Figure src={img('student_view.png')} alt="Student-facing session view showing a classroom task prompt" width={1600} height={843} caption="Student view: prompts only." />
        </div>
        <figure className="panel overflow-hidden">
          <video controls preload="none" playsInline poster={img('teacher_view.png')} className="h-auto w-full" aria-label="Teacher dashboard demonstration">
            <source src={img('teacher-dashboard-demo.mp4')} type="video/mp4" />
          </video>
          <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
            Dashboard demonstration: session controls and engagement-proxy display.
            <span className="tag-recorded shrink-0">Recorded</span>
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
