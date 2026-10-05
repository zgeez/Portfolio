import { featuredProjects, secondaryProjects } from '@/data/projects';
import { SectionHeading } from './ui';
import { CompactProjectCard, ProjectCard } from './project-card';

export function FeaturedProjects() {
  const [lead, ...rest] = featuredProjects;
  return (
    <section aria-labelledby="systems-title" id="systems" className="container scroll-mt-20 py-20 md:py-28">
      <SectionHeading id="systems-title" eyebrow="Featured systems" title="Systems, from product to signals">
        Each one opens into layers: product, architecture, firmware, hardware, and the measurements behind the claims.
      </SectionHeading>

      <div className="grid gap-5">
        <ProjectCard project={lead} large />
        <div className="grid gap-5 md:grid-cols-2">
          {rest.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="label mb-4">More systems</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {secondaryProjects.map((p) => (
            <CompactProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
