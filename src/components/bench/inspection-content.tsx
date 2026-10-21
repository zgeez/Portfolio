import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Tabs from '@radix-ui/react-tabs';
import { getProject, sortedProjects, type Project } from '@/data/projects';
import { credentials, debugStories, education, experience, research, skillLayers } from '@/data/profile';
import { site } from '@/data/site';
import { inspections, projectTargets, type BenchTarget } from '@/data/bench';
import { benchMedia, benchSystems, instrumentViews, type BenchPhoto } from '@/data/bench-content';

type Select = (target: BenchTarget, trigger: HTMLElement) => void;

function TechnologyList({ items }: { items: string[] }) {
  return <ul className="inspection-technologies" aria-label="Technologies">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function EvidenceGallery({ photos }: { photos: BenchPhoto[] }) {
  const [index, setIndex] = useState(0);
  const photo = photos[index];
  return <div className="inspection-gallery">
    <figure><div className="inspection-media-frame"><Image key={photo.src} src={photo.src} alt={photo.caption} width={1000} height={700} sizes="(max-width: 767px) 90vw, 420px" /></div><figcaption><span>{photo.kind}</span>{photo.caption}</figcaption></figure>
    {photos.length > 1 && <div className="gallery-controls"><button onClick={() => setIndex((index + photos.length - 1) % photos.length)} aria-label="Previous project image">←</button><span aria-live="polite">{index + 1} / {photos.length}</span><button onClick={() => setIndex((index + 1) % photos.length)} aria-label="Next project image">→</button></div>}
  </div>;
}

function ProjectInspection({ target, project }: { target: BenchTarget; project: Project }) {
  const inspection = inspections[target];
  const instrument = target === 'stm32' || target === 'board' || target === 'logic' ? instrumentViews[target] : undefined;
  const architecture = instrument?.architecture ?? benchSystems[project.slug as keyof typeof benchSystems];
  const media = benchMedia[project.slug] ?? [{ src: project.image, caption: project.imageAlt, kind: 'Project image' as const }];
  const photos = target === 'stm32' ? [...media].reverse() : media;
  const metrics = instrument ? inspection.lines ?? [] : project.metrics?.map((metric) => ({ label: metric.label, value: metric.value })) ?? [];
  return <Tabs.Root defaultValue="overview" className="inspection-tabs">
    <Tabs.List className="inspection-tab-list" aria-label={`${project.title} details`}><Tabs.Trigger value="overview">Overview</Tabs.Trigger><Tabs.Trigger value="system">Build</Tabs.Trigger><Tabs.Trigger value="evidence">Evidence</Tabs.Trigger></Tabs.List>
    <Tabs.Content value="overview" className="inspection-tab-content">
      <p className="inspection-summary">{instrument?.summary ?? project.summary}</p>
      {!!metrics.length && <dl className="inspection-metrics">{metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>}
      <p className="inspection-hook">{instrument?.hook ?? project.hook}</p>
      {project.role && <p className="inspection-role"><span>My role</span>{project.role}</p>}
      {instrument && <div className="inspection-note"><h3>{target === 'board' ? 'Hardware paths' : 'Capture capabilities'}</h3><ul>{instrument.specs.map((spec) => <li key={spec}>{spec}</li>)}</ul></div>}
      <TechnologyList items={project.technologies} />
    </Tabs.Content>
    <Tabs.Content value="system" className="inspection-tab-content">
      {architecture ? <><p className="inspection-summary">Select a component to inspect its part in the system.</p><ol className="inspection-system">{architecture.map((node, index) => <li key={node.id}><details><summary><span className="system-index">{String(index + 1).padStart(2, '0')}</span><span><strong>{node.label}</strong><small>{node.sub}</small></span><span className="details-mark" aria-hidden="true">+</span></summary><ul>{node.probe?.items.map((item) => <li key={item}>{item}</li>)}</ul></details></li>)}</ol></> : <><p className="inspection-summary">{project.hook}</p><TechnologyList items={project.technologies} /><p className="inspection-summary">The full case study contains implementation details and project evidence.</p></>}
      {project.links && <div className="inspection-resources">{project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>}
    </Tabs.Content>
    <Tabs.Content value="evidence" className="inspection-tab-content"><EvidenceGallery photos={photos} /></Tabs.Content>
  </Tabs.Root>;
}

function ProjectLibrary({ onSelect }: { onSelect: Select }) {
  return <div className="inspection-project-list">{sortedProjects.map((project) => {
    const target = projectTargets[project.slug];
    const content = <><Image src={project.thumb} alt="" width={90} height={65} sizes="90px" /><span><strong>{project.shortTitle ?? project.title}</strong><small>{project.technologies.slice(0, 3).join(' / ')}</small></span><span aria-hidden="true">→</span></>;
    return target
      ? <button key={project.slug} onClick={(event) => onSelect(target, event.currentTarget)} className="inspection-project-row">{content}</button>
      : <Link key={project.slug} href={`/projects/${project.slug}/`} className="inspection-project-row">{content}</Link>;
  })}</div>;
}

function DebugInspection() {
  return <div className="inspection-debug-stories">{debugStories.map((story, index) => <details key={story.id} open={index === 0 ? true : undefined}><summary><span><strong>{story.title}</strong><small>{story.headline}</small></span><span className="details-mark" aria-hidden="true">+</span></summary><dl>{story.steps.map((step, index) => <div key={`${step.stage}-${index}`}><dt>{step.stage}</dt><dd>{step.text}</dd></div>)}</dl><Link href={`/projects/${story.project}/#${story.anchor}`}>Read full postmortem →</Link></details>)}</div>;
}

function ExperienceInspection() {
  return <div className="inspection-timeline"><article><span className="inspection-section-label">Research</span><h3>{research.role}</h3><p className="timeline-organization">{research.org}</p><time>{research.dates}</time><ul>{research.points.map((point) => <li key={point}>{point}</li>)}</ul><Link href={`/projects/${research.project}/`}>Explore the EEG system →</Link></article>{experience.map((job) => <article key={job.role}><span className="inspection-section-label">Experience</span><h3>{job.role}</h3><p className="timeline-organization">{job.org}</p><time>{job.dates}</time><p>{job.summary}</p></article>)}<a className="inspection-resume-link" href={site.resume} target="_blank" rel="noopener noreferrer">Open complete resume ↗</a></div>;
}

function AboutInspection() {
  return <Tabs.Root defaultValue="education" className="inspection-tabs">
    <Tabs.List className="inspection-tab-list" aria-label="About Ziad"><Tabs.Trigger value="education">Education</Tabs.Trigger><Tabs.Trigger value="skills">Skills</Tabs.Trigger><Tabs.Trigger value="credentials">Credentials</Tabs.Trigger></Tabs.List>
    <Tabs.Content value="education" className="inspection-tab-content"><p className="inspection-summary">Electrical and computer engineering, based in {site.location}. I work where firmware, sensing, and physical hardware meet.</p><h3 className="inspection-subheading">{education.school}</h3><ol className="inspection-degrees">{education.degrees.map((degree) => <li key={degree.name}><strong>{degree.name}</strong><span>{degree.date}</span></li>)}</ol><h3 className="inspection-subheading">Honors</h3><ul className="inspection-honors">{education.honors.map((honor) => <li key={honor}>{honor}</li>)}</ul></Tabs.Content>
    <Tabs.Content value="skills" className="inspection-tab-content"><p className="inspection-summary">Tools and technologies across application, firmware, hardware, and debugging.</p><div className="inspection-skill-layers">{skillLayers.map((layer) => <details key={layer.layer}><summary>{layer.layer}<span className="details-mark" aria-hidden="true">+</span></summary><TechnologyList items={layer.items} /></details>)}</div></Tabs.Content>
    <Tabs.Content value="credentials" className="inspection-tab-content"><ul className="inspection-credentials">{credentials.selected.map((credential) => <li key={credential.title}><strong>{credential.title}</strong><span>{credential.issuer}{credential.date && ` · ${credential.date}`}</span></li>)}</ul></Tabs.Content>
  </Tabs.Root>;
}

function ContactInspection() {
  return <div className="inspection-contact"><p className="inspection-summary">Open to embedded and firmware engineering roles. The fastest way to reach me is email.</p><a className="contact-email" href={`mailto:${site.email}`}>{site.email}</a><div className="contact-links"><a href={site.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={site.resume} target="_blank" rel="noopener noreferrer">Resume PDF ↗</a></div></div>;
}

export function InspectionContent({ target, onSelect }: { target: BenchTarget; onSelect: Select }) {
  const project = getProject(inspections[target].projectSlug ?? '');
  if (project) return <ProjectInspection target={target} project={project} />;
  if (target === 'projects') return <ProjectLibrary onSelect={onSelect} />;
  if (target === 'debug') return <DebugInspection />;
  if (target === 'experience') return <ExperienceInspection />;
  if (target === 'about') return <AboutInspection />;
  return <ContactInspection />;
}
