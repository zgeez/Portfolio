import Link from 'next/link';
import { debugStories } from '@/data/profile';
import { SectionHeading } from './ui';

export function DebugLog() {
  return (
    <section aria-labelledby="debug-title" id="debug" className="border-y border-line bg-bg-elevated">
      <div className="container py-20 md:py-28">
        <SectionHeading id="debug-title" eyebrow="Debug log" title="Measured, then explained">
          Problem, root cause, result. Open a postmortem for the measurements and complete debugging process.
        </SectionHeading>
        <div className="grid gap-5 lg:grid-cols-3">
          {debugStories.map((story, i) => (
            <article key={story.id} className="flex flex-col border-t border-line-strong pt-5">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-dim">
                0x{(i + 1).toString(16).padStart(2, '0')} · {story.title}
              </p>
              <p className="mt-3 font-mono text-2xl text-accent">{story.headline}</p>
              <div className="mt-5 flex-1">
                <dl className="space-y-4">
                  {[
                    { label: 'Problem', step: story.steps[0] },
                    { label: 'Root cause', step: story.steps.find((step) => step.stage === 'Root cause')! },
                    { label: 'Result', step: story.steps.find((step) => step.stage === 'Result')! },
                  ].map(({ label, step }) => (
                    <div key={label}>
                      <dt className={`font-mono text-[0.68rem] uppercase tracking-[0.12em] ${label === 'Root cause' ? 'text-warning' : 'text-dim'}`}>{label}</dt>
                      <dd className="mt-1 text-sm text-muted">{step.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <Link
                href={`/projects/${story.project}/#${story.anchor}`}
                className="mt-2 inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-accent hover:text-accent-strong"
              >
                Full postmortem →<span className="sr-only">: {story.title}</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
