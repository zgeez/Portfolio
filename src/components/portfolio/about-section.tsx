import { credentials, education } from '@/data/profile';
import { SectionHeading } from './ui';

export function AboutSection() {
  return (
    <section aria-labelledby="about-title" id="about" className="border-t border-line bg-bg-elevated">
      <div className="container grid gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <SectionHeading id="about-title" eyebrow="About" title="Where firmware meets hardware" />
          <div className="space-y-4 text-muted">
            <p>
              I’m an electrical and computer engineer at NYIT, with a B.S. in 2026 and an accelerated M.S. underway,
              based in Brooklyn.
            </p>
            <p>
              The layer I like most is the one where code has to agree with physics: DMA-fed peripherals,
              timer-synchronized acquisition, protocols on the wire, and the measurements that show a system does what
              it claims, including where it doesn’t.
            </p>
          </div>
        </div>

        <div>
          <h3 className="label mb-4">Education &amp; selected credentials</h3>
          <div className="rounded-xl border border-line bg-panel p-6">
            <p className="font-semibold text-fg">{education.school}</p>
            <ul className="mt-3 space-y-2">
              {education.degrees.map((d) => (
                <li key={d.name} className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
                  <span className="text-muted">{d.name}</span>
                  <span className="font-mono text-xs text-dim">{d.date}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-dim">{education.honors.join(' · ')}</p>
          </div>

          <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
            {credentials.selected.map((c) => (
              <li key={c.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <span className="text-fg">{c.title}</span>
                <span className="font-mono text-xs text-dim">
                  {c.issuer} · {c.date}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-dim">Also: {credentials.also.join(' · ')}</p>
        </div>
      </div>
    </section>
  );
}
