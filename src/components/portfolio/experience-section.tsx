import Link from 'next/link';
import { experience, research } from '@/data/profile';
import { site } from '@/data/site';
import { Bullets, SectionHeading } from './ui';

export function ExperienceSection() {
  return (
    <section aria-labelledby="research-title" className="container py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div id="research" className="scroll-mt-24">
          <SectionHeading id="research-title" eyebrow="Research" title="Embedded EEG acquisition" />
          <article className="rounded-xl border border-line bg-panel p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-fg">{research.role}</h3>
                <p className="text-muted">{research.org}</p>
              </div>
              <p className="font-mono text-xs text-dim">{research.dates}</p>
            </div>
            <Bullets className="mt-5" items={research.points} />
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Focus areas">
              {research.tags.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href={`/projects/${research.project}/`}
              className="mt-6 inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-accent hover:text-accent-strong"
            >
              Explore the system →
            </Link>
          </article>
        </div>

        <div id="experience" className="scroll-mt-24">
          <div className="mb-8">
            <p className="eyebrow">Experience</p>
            <h2 className="section-title mt-2">Also</h2>
          </div>
          <ol className="space-y-6">
            {experience.map((job) => (
              <li key={job.role} className="border-l border-line pl-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold text-fg">{job.role}</h3>
                  <p className="font-mono text-xs text-dim">{job.dates}</p>
                </div>
                <p className="text-sm text-muted">{job.org}</p>
                <p className="mt-2 text-sm text-muted">{job.summary}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-dim">
            Full history on the{' '}
            <a href={site.resume} target="_blank" rel="noopener noreferrer" className="link-accent">
              resume
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
