import type { Project } from '@/data/projects';
import {
  stm32HeroMetrics,
  stm32Layers,
  stm32Limits,
  stm32Links,
  stm32Metrics,
  stm32Validation,
} from '@/data/stm32-msi';
import { AbstractionLens } from '@/components/portfolio/abstraction/abstraction-lens';
import { CaseSection, OnThisPage, ProjectHeader } from '@/components/portfolio/project-header';
import { Bullets, Callout, DataTable, ExternalLink, MetricGrid } from '@/components/portfolio/ui';
import { ProductLayer } from './product-layer';
import { SystemLayer } from './system-layer';
import { FirmwareLayer } from './firmware-layer';
import { HardwareLayer } from './hardware-layer';
import { SignalsLayer } from './signals-layer';

const MEASUREMENTS: [string, string, string][] = [
  ['Logic capture rate', '9.882 MS/s', '8 channels sampled together'],
  ['Scope capture rate', '1 MS/s', 'two channels, simultaneous sample pairs'],
  ['Analog/digital skew', '−120 ns', 'shared hardware start; matches the 143 ns ADC aperture'],
  ['Command round trip, median', '0.221 ms', 'was 19.997 ms before the notification fix'],
  ['Capture throughput', '206 kB/s', 'was 2.40 kB/s'],
  ['Transfer, 2048 samples', '39.79 ms', 'was 3419.7 ms'],
  ['Sample loss', '< 1 in 81,000', 'no isolated drops; worst of four rates, 30 captures each'],
  ['DDS frequency step', '93.13 µHz', '32-bit phase accumulator at 400 kS/s'],
  ['10 kHz sine, measured', '9999.822 Hz', 'scope readout in the application'],
];

export function Stm32CaseStudy({ project }: { project: Project }) {
  return (
    <div className="space-y-14 md:space-y-20">
      <div className="space-y-8">
        <ProjectHeader project={project} metrics={stm32HeroMetrics} />
        <OnThisPage
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'layers', label: 'Architecture → Signals' },
            { id: 'measurements', label: 'Measurements' },
            { id: 'validation', label: 'Validation' },
            { id: 'limitations', label: 'Limitations' },
            { id: 'source', label: 'Source' },
          ]}
        />
      </div>

      <CaseSection id="overview" eyebrow="Overview" title="Generate, capture and correlate from one board">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="space-y-4 text-muted">
            <p>
              The project asked whether one board a student already owns can do the work of three bench instruments,
              driven by an application on the host. The answer required the whole chain: firmware in C on FreeRTOS, a
              versioned binary protocol over USB CDC, and a PySide6 desktop application that configures the outputs,
              pulls captures, measures them, and decodes serial traffic.
            </p>
            <p>
              The part that took the most work does not appear in the feature list: showing that the instrument does
              what it says, with measurements, tests, and stated limits.
            </p>
          </div>
          <MetricGrid
            className="md:grid-cols-2"
            metrics={[stm32Metrics.tasks, stm32Metrics.dma, stm32Metrics.commands, stm32Metrics.ddsStep]}
          />
        </div>
      </CaseSection>

      <section id="layers" aria-labelledby="layers-title" className="scroll-mt-24">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Abstraction lens</p>
          <h2 id="layers-title" className="section-title mt-2">
            Peel the system apart
          </h2>
          <p className="mt-3 text-muted">
            Five layers, from what the instrument does down to the signals it captures. Stop at any depth.
          </p>
        </div>
        <AbstractionLens
          layers={stm32Layers}
          panels={[
            <ProductLayer key="product" />,
            <SystemLayer key="system" />,
            <FirmwareLayer key="firmware" />,
            <HardwareLayer key="hardware" />,
            <SignalsLayer key="signals" />,
          ]}
        />
      </section>

      <CaseSection id="measurements" eyebrow="Measurements" title="Measured results">
        <DataTable
          head={['Measurement', 'Value', 'Context']}
          rows={MEASUREMENTS.map(([m, v, c]) => [m, <span key="v" className="font-mono text-accent">{v}</span>, c])}
        />
        <p className="mt-3 text-xs text-dim">
          Voltage and frequency figures are measured against the board’s own references. They are not calibrated or
          certified against a traceable standard.
        </p>
      </CaseSection>

      <CaseSection id="validation" eyebrow="Testing & evidence" title="Validation">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 text-muted lg:col-span-1">
            <p>
              Rather than assume the DMA paths keep up, sample loss was{' '}
              <strong className="text-fg">bounded below 1 in 81,000 samples with no isolated drops</strong>, measured
              against an on-board timer reference across the worst of four rates, 30 captures each.
            </p>
            <p>
              The C suites compile the actual firmware sources rather than a reimplementation, so a host test failing
              means the firmware is wrong and not that a stand-in drifted from it.
            </p>
          </div>
          <section className="panel p-5">
            <p className="label">Automated tests</p>
            <Bullets className="mt-3" items={stm32Validation.tests} />
          </section>
          <section className="panel p-5">
            <p className="label">Coverage &amp; records</p>
            <Bullets className="mt-3" items={stm32Validation.records} />
          </section>
        </div>
      </CaseSection>

      <CaseSection id="limitations" eyebrow="Limitations" title="Stated limits">
        <p className="mb-5 max-w-3xl text-muted">
          The characterization document lists what is not established as carefully as what is. These are the limits as
          written, not caveats added afterwards.
        </p>
        <DataTable
          head={['Area', 'What is not established', 'Why']}
          rows={stm32Limits.map((l) => [l.area, l.notEstablished, l.why])}
        />
      </CaseSection>

      <CaseSection id="source" eyebrow="Source / releases" title="Read the code">
        <Callout tone="accent">
          <p>
            Built with STM32 HAL and FreeRTOS in C, CMake and the Arm GNU Toolchain, and a Python desktop package with a
            PySide6 interface. Source, validation report and characterization document are in the repository; the
            application and firmware are on the releases page.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <ExternalLink href={stm32Links.repo}>github.com/zgeez/stm32-mixed-signal-instrument</ExternalLink>
            <ExternalLink href={stm32Links.releases}>Releases</ExternalLink>
          </div>
        </Callout>
      </CaseSection>
    </div>
  );
}
