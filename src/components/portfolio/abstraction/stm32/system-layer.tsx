import { stm32SystemDiagram } from '@/data/stm32-msi';
import { ProbeDiagram } from '@/components/portfolio/abstraction/probe-diagram';
import { Bullets } from '@/components/portfolio/ui';

export function SystemLayer() {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-muted">
        Three layers talk to each other: a host application, a USB link carrying a versioned binary protocol, and the
        instrument blocks on the microcontroller. Probe any block for the verified details behind it.
      </p>

      <ProbeDiagram data={stm32SystemDiagram} />

      <div className="grid gap-4 md:grid-cols-3">
        <section className="panel p-5">
          <p className="label">Host</p>
          <Bullets
            className="mt-3"
            items={[
              'PySide6 desktop application and a CLI',
              'Pulls captures, measures them, decodes UART / SPI / I2C',
              'Firmware older than expected: both versions named, connection kept',
            ]}
          />
        </section>
        <section className="panel p-5">
          <p className="label">Link</p>
          <Bullets
            className="mt-3"
            items={[
              'Versioned binary protocol, 28 commands',
              'COBS framing over USB CDC',
              'Native CDC port, separate from ST-LINK',
            ]}
          />
        </section>
        <section className="panel p-5">
          <p className="label">Operating modes</p>
          <Bullets
            className="mt-3"
            items={[
              'Scope and logic acquisition modes are mutually exclusive',
              'The generator runs alongside either',
              'A separate mixed mode puts analog and digital capture on one timeline',
            ]}
          />
        </section>
      </div>
    </div>
  );
}
