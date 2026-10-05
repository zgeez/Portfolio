import type { Project } from '@/data/projects';
import { asset } from '@/data/site';
import { AbstractionLens, type LensLayerMeta } from '@/components/portfolio/abstraction/abstraction-lens';
import { CaseSection, OnThisPage, ProjectHeader } from '@/components/portfolio/project-header';
import { Bullets, Callout, DataTable, Figure, MetricGrid } from '@/components/portfolio/ui';
import { XorDiffDemo } from './xor-diff-demo';

const img = (name: string) => asset(`assets/electromagnetic-display/${name}`);

const LAYERS: LensLayerMeta[] = [
  { id: 'product', label: 'Product', caption: 'A digit that moves instead of glowing' },
  { id: 'mechanics', label: 'Mechanics', caption: 'Rails, magnets and a screw for a core' },
  { id: 'electronics', label: 'Electronics', caption: 'Coils and H-bridges' },
  { id: 'firmware', label: 'Firmware', caption: 'Pulse only what changes' },
  { id: 'energy', label: 'Energy', caption: 'Where the 100× comes from' },
];

const HEADER_METRICS = [
  { value: '~12.5 mW', label: 'average display power', detail: '≈2.5 mA at 5 V' },
  { value: '100×', label: 'less than an LED digit', detail: '≈250 mA / ~1.25 W' },
  { value: '25 ms', label: 'actuation pulse', detail: 'zero hold current' },
  { value: '400', label: 'turns per coil', detail: 'M3 screw core' },
];

function ProductLayer() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-start">
      <div className="space-y-4 text-muted">
        <p className="text-lg leading-relaxed text-fg">
          A tactile, daylight-readable digit that spends power only when it changes.
        </p>
        <p>
          Traditional LED displays idle at ≈250 mA. Here each segment is a PLA bar with an N35 magnet; a 400-turn
          screw-core coil repels or attracts it for 25 ms, then consumes nothing until the next change.
        </p>
        <p>
          The build covers precision electromechanics, energy-aware firmware, and rapid-prototyped mechanics in one
          single-digit module.
        </p>
        <Figure src={img('assembly.webp')} alt="Completed single-digit module on a desk" width={1600} height={1605} caption="Assembled module." />
      </div>
      <figure className="panel overflow-hidden">
        <video
          controls
          muted
          loop
          playsInline
          preload="none"
          width={399}
          height={550}
          poster={img('demo-poster.jpg')}
          aria-label="Demo of the kinetic digit counting down from 9 to 0"
          className="h-auto w-full"
        >
          <source src={img('demo.webm')} type="video/webm" />
          <source src={img('demo.mp4')} type="video/mp4" />
        </video>
        <figcaption className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 text-sm text-muted">
          Counting 9 → 0 with &lt;25 ms pulses.
          <span className="tag-recorded shrink-0">Recorded</span>
        </figcaption>
      </figure>
    </div>
  );
}

function MechanicsLayer() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Figure src={img('cad_model.png')} alt="CAD cut-away of the rail and coil" width={1026} height={982} caption="CAD model of the rail and coil." />
      <div className="space-y-5">
        <Bullets
          items={[
            'Each segment is a PLA bar carrying an N35 magnet, riding a 3D-printed low-friction rail',
            'An M3 screw is the coil’s low-cost steel core',
            'The PLA rail keeps skew under 0.1 mm, so a 1 A pulse yields 7 mm of travel',
            'Bistable: a bar stays where it was pushed with no current applied',
          ]}
        />
        <Callout tone="warning" title="Pain point">
          Rail printing demanded ±0.02 mm tolerance.
        </Callout>
      </div>
    </div>
  );
}

function ElectronicsLayer() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Figure src={img('coil.webp')} alt="Hand-wound coil on an M3 screw next to a TB6612 driver board" width={1600} height={1200} caption="400-turn screw-core coil and TB6612 driver." />
      <div className="space-y-5">
        <Bullets
          items={[
            'Hand-wound 400-turn coils, hot-swappable',
            'Seven TB6612 H-bridge channels, driven directly from 14 GPIOs',
            'Polarity of the pulse decides whether the bar is pushed or pulled',
            'Next revision: multiplex through a 74HC595 to free I/O',
          ]}
        />
      </div>
    </div>
  );
}

function FirmwareLayer() {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-muted">
        The segment font lives in flash. Each update, the loop XORs the desired mask with the current one and energizes
        only the bars that changed, for under 25 ms each. Nothing is driven to hold a state.
      </p>
      <XorDiffDemo />
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Figure src={img('firmware.png')} alt="Firmware excerpt showing the XOR diff and pulse scheduling" width={845} height={645} caption="XOR-diff pulse scheduler." />
        <Callout tone="warning" title="Debug note">
          The first coils overheated. Gating actuation on the XOR diff, so unchanged bars are never pulsed, fixed it.
        </Callout>
      </div>
    </div>
  );
}

function EnergyLayer() {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-muted">
        Power is spent only during pulses, so the average is set by pulse current, pulse width and how many pulses
        happen per minute. The budget below assumes 8 pulses a minute, a conservative figure for a display that changes
        once a minute.
      </p>
      <DataTable
        head={['Quantity', 'Value', 'How']}
        rows={[
          ['Pulse', <span key="p" className="font-mono text-accent">0.75 A × 25 ms</span>, 'one bar, one move'],
          ['Pulse budget', <span key="b" className="font-mono text-accent">8 / min</span>, 'conservative'],
          ['Average current', <span key="i" className="font-mono text-accent">≈2.5 mA</span>, '0.75 A × 0.025 s × 8 ÷ 60 s'],
          ['Average power', <span key="w" className="font-mono text-accent">~12.5 mW</span>, '2.5 mA × 5 V'],
          ['Comparable LED digit', <span key="l" className="font-mono">≈250 mA · ~1.25 W</span>, 'always on'],
          ['Ratio', <span key="r" className="font-mono text-accent">100×</span>, '250 mA ÷ 2.5 mA'],
        ]}
      />
      <MetricGrid
        metrics={[
          { value: '0 mA', label: 'hold current' },
          { value: '~12.5 mW', label: 'average power' },
          { value: '~1.25 W', label: 'LED digit, for comparison' },
          { value: '100×', label: 'less energy' },
        ]}
      />
    </div>
  );
}

export function KineticCaseStudy({ project }: { project: Project }) {
  return (
    <div className="space-y-14 md:space-y-20">
      <div className="space-y-8">
        <ProjectHeader project={project} metrics={HEADER_METRICS} />
        <OnThisPage
          items={[
            { id: 'layers', label: 'Product → Energy' },
            { id: 'reflection', label: 'What worked & next' },
            { id: 'built-with', label: 'Built with' },
          ]}
        />
      </div>

      <section id="layers" aria-labelledby="layers-title" className="scroll-mt-24">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Abstraction lens</p>
          <h2 id="layers-title" className="section-title mt-2">
            From a moving digit to milliwatts
          </h2>
        </div>
        <AbstractionLens
          layers={LAYERS}
          panels={[
            <ProductLayer key="product" />,
            <MechanicsLayer key="mechanics" />,
            <ElectronicsLayer key="electronics" />,
            <FirmwareLayer key="firmware" />,
            <EnergyLayer key="energy" />,
          ]}
        />
      </section>

      <CaseSection id="reflection" eyebrow="Reflection" title="What worked, and what’s next">
        <div className="grid gap-4 md:grid-cols-3">
          <Callout tone="accent" title="Worked">
            Repeatable motion, no hold current, and hot-swap coils proved the mechanical concept.
          </Callout>
          <Callout tone="warning" title="Pain points">
            Coils overheated until XOR gating was added; rail printing demanded ±0.02 mm tolerance.
          </Callout>
          <Callout title="Roadmap">
            Shift-register I/O, an air-core/keeper redesign to halve pulse current, BLE OTA updates, and a 4-digit
            backplane PCB.
          </Callout>
        </div>
      </CaseSection>

      <CaseSection id="built-with" eyebrow="Built with" title="Stack">
        <p className="text-muted">Fusion 360, KiCad, STM32CubeIDE, and C firmware.</p>
      </CaseSection>
    </div>
  );
}
