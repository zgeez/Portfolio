import { stm32HardwareDiagram, stm32Pins } from '@/data/stm32-msi';
import { ProbeDiagram } from '@/components/portfolio/abstraction/probe-diagram';
import { Callout, DataTable } from '@/components/portfolio/ui';

export function HardwareLayer() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 text-muted">
          <p>
            The distinctive part of the instrument is not the instrument count; it is that two capture paths running at
            different rates can be compared against each other. Every timer on the device divides the same crystal,
            which is what makes a shared timebase possible in the first place.
          </p>
          <p>
            <strong className="text-fg">TIM1’s trigger output releases a slaved TIM2</strong>, so a logic capture and an
            analog capture start from one hardware event rather than from two software commands that happen to be close
            together.
          </p>
        </div>
        <DataTable
          head={['Block', 'Pins', 'Peripheral']}
          rows={stm32Pins.map((p) => [p.block, <span key="p" className="font-mono text-accent">{p.pins}</span>, p.peripheral])}
        />
      </div>

      <ProbeDiagram data={stm32HardwareDiagram} />

      <Callout title="What is not drawn">
        Four concurrent DMA streams is a documented count. The exact DMA controller and stream numbers are
        left out because the project write-up does not document them, and this page does not guess.
      </Callout>
    </div>
  );
}
