import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type React from 'react';
import { SITE_URL } from '@/data/site';
import { getProject, projects, type Project } from '@/data/projects';
import { Stm32CaseStudy } from '@/components/portfolio/abstraction/stm32/stm32-case-study';
import { EegCaseStudy } from '@/components/portfolio/abstraction/eeg/eeg-case-study';
import { WaypointCaseStudy } from '@/components/portfolio/abstraction/waypoint/waypoint-case-study';
import { KineticCaseStudy } from '@/components/portfolio/abstraction/kinetic/kinetic-case-study';
import { SecurityCameraCaseStudy } from '@/components/portfolio/case-studies/security-camera';
import { IotAutomationCaseStudy } from '@/components/portfolio/case-studies/iot-automation';
import { WirelessChargingCaseStudy } from '@/components/portfolio/case-studies/wireless-charging';
import { IGuardCaseStudy } from '@/components/portfolio/case-studies/iguard';

type Params = { params: Promise<{ slug: string }> };

const CASE_STUDIES: Record<string, React.FC<{ project: Project }>> = {
  'stm32-mixed-signal-instrument': Stm32CaseStudy,
  'eeg-acquisition-neurofeedback-system': EegCaseStudy,
  'led-waypoint-compass': WaypointCaseStudy,
  'electromagnetic-kinetic-7-segment-display': KineticCaseStudy,
  'smart-security-camera-raspberry-pi': SecurityCameraCaseStudy,
  'iot-device-automation': IotAutomationCaseStudy,
  'nyc-dynamic-wireless-charging-roads': WirelessChargingCaseStudy,
  'iguard-incident-reporting-app': IGuardCaseStudy,
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project not found' };
  const url = `${SITE_URL}/projects/${project.slug}/`;
  const image = `${SITE_URL}${project.image.replace(/^\/portfolio/, '')}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: project.title,
      description: project.summary,
      images: [{ url: image, alt: project.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: project.title, description: project.summary, images: [image] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const CaseStudy = CASE_STUDIES[project.slug];

  return (
    <div className="container py-10 md:py-14">
      <CaseStudy project={project} />
    </div>
  );
}
