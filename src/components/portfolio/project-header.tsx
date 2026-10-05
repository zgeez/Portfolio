import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Project, ProjectMetric } from '@/data/projects';
import { Chips, ExternalLink, MetricGrid } from '@/components/portfolio/ui';

const CATEGORY: Record<Project['category'], string> = {
  firmware: 'Firmware / Embedded',
  research: 'Research',
  'embedded-linux': 'Embedded Linux',
  iot: 'IoT',
  software: 'Software',
};

export function ProjectHeader({
  project,
  metrics = project.metrics,
}: {
  project: Project;
  metrics?: readonly (ProjectMetric & { detail?: string })[];
}) {
  return (
    <header className="space-y-6">
      <Link href="/#systems" className="inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-dim transition-colors hover:text-accent">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All systems
      </Link>
      <div className="max-w-4xl">
        <p className="eyebrow">
          {String(project.order).padStart(2, '0')} · {CATEGORY[project.category]}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg md:text-5xl">{project.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{project.summary}</p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Chips items={project.technologies} />
        {project.links && project.links.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {project.links.map((l) => (
              <ExternalLink key={l.href} href={l.href}>
                {l.label}
              </ExternalLink>
            ))}
          </div>
        )}
      </div>
      {project.role && (
        <p className="text-sm text-muted">
          <span className="label mr-2">Role</span>
          {project.role}
        </p>
      )}
      {metrics && metrics.length > 0 && <MetricGrid metrics={metrics} size="lg" />}
    </header>
  );
}

export function OnThisPage({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="flex flex-wrap items-center gap-1.5 border-y border-line py-3">
      <span className="label mr-2">On this page</span>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className="chip min-h-8 hover:border-accent/50 hover:text-fg">
          {it.label}
        </a>
      ))}
    </nav>
  );
}

export function CaseSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} id={id} className="scroll-mt-24">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`} className="section-title mb-6 mt-2">
        {title}
      </h2>
      {children}
    </section>
  );
}
