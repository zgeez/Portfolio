import { asset } from '@/data/site';
import { stm32Instruments, stm32Links } from '@/data/stm32-msi';
import { Bullets, Callout, Chips, ExternalLink, Figure } from '@/components/portfolio/ui';

export function ProductLayer() {
  return (
    <div className="space-y-8">
      <div className="dossier-split">
        <div className="space-y-4 text-muted">
          <p className="text-lg leading-relaxed text-fg">One board, three instruments, one timeline.</p>
          <p>
            A student who wants to see a signal usually needs three separate instruments, and the bench that has all
            three is the one they cannot take home. One board provides a 2-channel arbitrary waveform generator, a
            2-channel oscilloscope, an 8-channel logic analyzer, and a combined mode that puts analog and digital
            capture on a <strong className="text-fg">single shared timeline</strong>.
          </p>
          <p>
            A PySide6 desktop application drives it, and ships as a single Windows executable that flashes the
            board’s firmware itself.
          </p>
          <Chips items={['STM32F407', 'FreeRTOS', 'USB CDC', 'C', 'Python', 'PySide6']} />
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm">
            <ExternalLink href={stm32Links.repo}>Source on GitHub</ExternalLink>
            <ExternalLink href={stm32Links.releases}>Download app + firmware</ExternalLink>
          </div>
        </div>
        <Figure
          src={asset('assets/stm32-msi/workspace.png')}
          alt="Desktop application window: waveform generator controls for outputs PA4 and PA5 on the left, and an oscilloscope capture of a 10 kHz sine at 1 MS/s with min, max, mean, RMS, Vpp, frequency and period readouts"
          width={2450}
          height={1575}
          priority
          kind="Recorded capture"
          caption="Generator controls on the left, capture display on the right; here a 10 kHz sine measured at 9999.822 Hz."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stm32Instruments.map((inst) => (
          <section key={inst.id} className="panel p-5">
            <p className="font-mono text-xs tracking-[0.14em] text-accent">{inst.short}</p>
            <h4 className="mt-1 font-semibold text-fg">{inst.name}</h4>
            <Bullets items={inst.specs} className="mt-3" />
          </section>
        ))}
      </div>

      <Callout tone="warning" title="Scope of use">
        This is an unprotected low-voltage prototype, not a product. Inputs must stay within the board’s own supply
        and reference limits: no mains, negative-voltage, or automotive inputs.
      </Callout>
    </div>
  );
}
