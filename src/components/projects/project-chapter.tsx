import type { ReactNode } from 'react';
import type { ProjectLayer } from './types';

export function CaseSection({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return <section id={id} data-project-chapter className="dossier-chapter" aria-labelledby={`${id}-title`}>
    <header className="dossier-section-heading"><p className="dossier-label">{eyebrow}</p><h2 id={`${id}-title`}>{title}</h2></header>
    <div className="dossier-chapter-content">{children}</div>
  </section>;
}

export function ProjectLayers({ layers, panels }: { layers: ProjectLayer[]; panels: ReactNode[] }) {
  return <div id="layers" className="dossier-layer-chapters">{layers.map((layer, index) => <CaseSection key={layer.id} id={`lens-${layer.id}`} eyebrow={layer.id === 'product' && layer.label === 'Product' ? 'Overview' : layer.label} title={layer.caption ?? layer.label}>{panels[index]}</CaseSection>)}</div>;
}
