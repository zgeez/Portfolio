import Link from 'next/link';
import { getProject } from '@/data/projects';
import { skillLayers } from '@/data/profile';
import { SectionHeading } from './ui';

export function SkillsStack() {
  return (
    <section aria-labelledby="skills-title" id="skills" className="container py-20 md:py-28">
      <SectionHeading id="skills-title" eyebrow="Skills, by layer" title="Tools & technical skills">
        Each layer links to the systems where it is put to work.
      </SectionHeading>
      <ol className="border-y border-line">
        {skillLayers.map((row, i) => (
          <li
            key={row.layer}
            className="grid gap-2 border-b border-line py-4 last:border-b-0 md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-6"
          >
            <p className="flex items-baseline gap-2.5">
              <span className="font-mono text-[0.68rem] text-dim">L{i}</span>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{row.layer}</span>
            </p>
            <p className="text-fg">
              {row.items.map((s, j) => (
                <span key={s}>
                  {j > 0 && (
                    <>
                      {' '}
                      <span aria-hidden className="mx-0.5 text-line-strong">·</span>{' '}
                    </>
                  )}
                  <span className="whitespace-nowrap">{s}</span>
                </span>
              ))}
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs md:justify-end" aria-label={`Projects using ${row.layer.toLowerCase()} skills`}>
              {row.evidence.map((slug) => {
                const p = getProject(slug);
                if (!p) return null;
                return (
                  <li key={slug}>
                    <Link href={`/projects/${slug}/`} className="text-dim underline-offset-4 transition-colors hover:text-accent hover:underline">
                      {p.shortTitle ?? p.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
