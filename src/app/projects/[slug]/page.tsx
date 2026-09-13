import { projects as allProjects, type Project } from '@/components/sections/projects-section';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import project content components
import SmartSecurityCameraRaspberryPiContent from '@/components/project-details/smart-security-camera-raspberry-pi-content';
import IGuardIncidentReportingAppContent from '@/components/project-details/iguard-incident-reporting-app-content';
import IotDeviceAutomationContent from '@/components/project-details/iot-device-automation-content';
import Stm32FunctionGeneratorContent from '@/components/project-details/stm32-function-generator-content';
import NycDynamicWirelessChargingRoadsContent from '@/components/project-details/nyc-dynamic-wireless-charging-roads-content';
import ElectromagneticKinetic7SegmentDisplayContent from '@/components/project-details/electromagnetic-kinetic-7-segment-display-content';
import EegAcquisitionNeurofeedbackSystemContent from '@/components/project-details/eeg-acquisition-neurofeedback-system-content';
import type React from 'react';

async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return allProjects.find(p => p.slug === slug);
}

export async function generateStaticParams() {
  return allProjects.map(project => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Ziad Ghanem`,
    description: project.summary, // Use the new summary field
  };
}

const ProjectContentComponents: { [key: string]: React.FC } = {
  'eeg-acquisition-neurofeedback-system': EegAcquisitionNeurofeedbackSystemContent,
  'smart-security-camera-raspberry-pi': SmartSecurityCameraRaspberryPiContent,
  'iguard-incident-reporting-app': IGuardIncidentReportingAppContent,
  'iot-device-automation': IotDeviceAutomationContent,
  'stm32-function-generator': Stm32FunctionGeneratorContent,
  'nyc-dynamic-wireless-charging-roads': NycDynamicWirelessChargingRoadsContent,
  'electromagnetic-kinetic-7-segment-display': ElectromagneticKinetic7SegmentDisplayContent,
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const ContentComponent = ProjectContentComponents[project.slug];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 md:py-16">
        <div className="mb-8">
          <Button variant="outline" asChild className="hover:bg-accent/10 hover:border-accent">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Projects
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden shadow-lg border-transparent">
          <CardHeader className="p-4 md:p-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary text-center uppercase tracking-wider">
              {project.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-3">
            <div className="max-w-4xl mx-auto">
              <div
                className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none text-foreground/80 prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-foreground/90"
              >
                {ContentComponent ? <ContentComponent /> : <p>Project content is being prepared. Please check back later.</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
