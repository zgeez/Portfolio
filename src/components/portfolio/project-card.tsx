import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/data/projects';
import { cn } from '@/lib/utils';

export function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-md border border-line bg-panel transition-colors duration-150 hover:border-accent/50',
        large && 'lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]',
      )}
    >
      <div className={cn('relative overflow-hidden border-b border-line bg-bg', large ? 'aspect-[16/10] lg:aspect-auto lg:border-b-0 lg:border-r' : 'aspect-[16/10]')}>
        <Image
          src={project.thumb}
          alt={project.imageAlt}
          fill
          sizes={large ? '(min-width: 1024px) 700px, 100vw' : '(min-width: 768px) 50vw, 100vw'}
          className="object-cover object-top transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.015]"
        />
        <span className="absolute left-3 top-3 rounded bg-bg/85 px-2 py-1 font-mono text-[0.68rem] text-accent backdrop-blur">
          {String(project.order).padStart(2, '0')}
        </span>
      </div>
      <div className={cn('flex flex-1 flex-col p-5', large && 'lg:p-8')}>
        <h3 className={cn('font-semibold tracking-tight text-fg', large ? 'text-2xl lg:text-3xl' : 'text-xl')}>{project.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{project.hook}</p>

        {project.metrics && (
          <dl className={cn('mt-5 grid gap-3', project.metrics.length > 2 ? 'grid-cols-3' : 'grid-cols-2')}>
            {project.metrics.map((m) => (
              <div key={m.label} className="flex flex-col border-l border-line pl-3 transition-colors group-hover:border-accent/40">
                <dt className="order-2 text-[0.72rem] leading-snug text-dim">{m.label}</dt>
                <dd className="order-1 font-mono text-sm text-muted transition-colors group-hover:text-fg md:text-base">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.slice(0, large ? 7 : 4).map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>

        <p className="mt-auto pt-6 font-mono text-xs uppercase tracking-[0.14em] text-accent">
          Explore layers <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
        </p>
      </div>
    </Link>
  );
}

export function CompactProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="group flex gap-4 border-t border-line py-5 transition-colors duration-150 hover:border-accent/50"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-sm bg-bg">
        <Image src={project.thumb} alt="" fill sizes="96px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-fg group-hover:text-accent">{project.shortTitle ?? project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{project.hook}</p>
        <p className="mt-2 truncate font-mono text-[0.7rem] text-dim">{project.technologies.slice(0, 4).join(' · ')}</p>
      </div>
    </Link>
  );
}
