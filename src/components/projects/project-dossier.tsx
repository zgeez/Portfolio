import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { sortedProjects, type Project } from '@/data/projects';
import { projectPresentation } from '@/data/project-dossiers';
import { projectTargets } from '@/data/bench';
import { ChapterNavigation } from './chapter-navigation';
import { ProjectArtifact } from './project-artifact';
import './project-dossier.css';

const categories = {
  firmware: 'Embedded systems / Instrumentation',
  research: 'Research / Sensing & simulation',
  'embedded-linux': 'Embedded Linux / Computer vision',
  iot: 'Connected systems / Automation',
  software: 'Software / Community tools',
};

export function ProjectDossier({ project, children }: { project: Project; children: ReactNode }) {
  const presentation = projectPresentation(project);
  const target = projectTargets[project.slug] ?? 'projects';
  const next = sortedProjects[(sortedProjects.findIndex(entry => entry.slug === project.slug) + 1) % sortedProjects.length];
  const primaryLink = project.links?.[0];
  return (
    <article className="project-dossier" data-project={project.slug}>
      <a className="dossier-skip" href={`#${presentation.chapters[0].id}`}>Skip to project content</a>
      <div className="dossier-topbar">
        <div>
          <Link href={`/#${target}`}><ArrowLeft size={15} aria-hidden /> Back to workbench</Link>
          <span className="dossier-breadcrumb">/ Project {String(project.order).padStart(2, '0')}</span>
        </div>
        {primaryLink ? (
          <a href={primaryLink.href} target="_blank" rel="noopener noreferrer">
            {primaryLink.label} <ArrowUpRight size={15} aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : <Link href="/#projects">All projects <ArrowUpRight size={15} aria-hidden /></Link>}
      </div>

      <header className="dossier-project-hero">
        <div className="dossier-project-intro">
          <p className="dossier-label">{categories[project.category]}</p>
          <h1 aria-label={project.title}>
            {presentation.title.map((line, index) => (
              <span key={line}>{line}{index === presentation.title.length - 1 && <b>.</b>}</span>
            ))}
          </h1>
          <p className="dossier-deck">{project.summary}</p>
          {project.role && <p className="dossier-role"><span>My role</span>{project.role}</p>}
        </div>
        <ProjectArtifact type={presentation.artifact} device={presentation.device} project={project} />
      </header>

      <dl
        className={`dossier-results${!presentation.metrics.length ? ' dossier-results-stack-only' : ''}`}
        style={{ '--dossier-metrics': presentation.metrics.length } as CSSProperties}
      >
        {presentation.metrics.map(metric => (
          <div key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.value}{metric.detail && <span>{metric.detail}</span>}</dd>
          </div>
        ))}
        <div className="dossier-stack">
          <dt>Built with</dt>
          <dd>
            {project.technologies.slice(0, 3).join(' · ')}
            {project.technologies.length > 3 && <span>{project.technologies.slice(3).join(' / ')}</span>}
          </dd>
        </div>
      </dl>

      <div className="dossier-document">
        <ChapterNavigation chapters={presentation.chapters} benchTarget={target} />
        <div className="dossier-content">
          {children}
          <footer className="dossier-document-end">
            <div>
              <p className="dossier-label">Back to the lab</p>
              <Link href={`/#${target}`}><ArrowLeft size={18} aria-hidden /> Return to the bench</Link>
              {project.links && (
                <div className="dossier-resource-links">
                  {project.links.map(link => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label} <ArrowUpRight size={14} aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <Link className="dossier-next-project" href={`/projects/${next.slug}/`}>
              <span className="dossier-label">Next project</span>
              {next.shortTitle ?? next.title}<ArrowRight size={17} aria-hidden />
            </Link>
          </footer>
        </div>
      </div>
    </article>
  );
}
