import { projects as allProjects, type Project } from '@/components/sections/projects-section';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return allProjects.find(p => p.slug === slug);
}

export async function generateStaticParams() {
  return allProjects.map(project => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  return {
    title: `${project.title} | Ziad Ghanem`,
    description: project.description.join(' '),
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

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
          <CardHeader className="p-6 md:p-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary text-center uppercase tracking-wider">
              {project.title}
            </CardTitle>
          </CardHeader>
          <div className="relative w-full aspect-[16/9] max-h-[500px] mx-auto bg-muted my-4 md:my-6">
             <Image
                src={project.image}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={project.imageHint}
              />
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
              {project.description && project.description.length > 0 && (
                <ul className="list-disc list-inside space-y-3 text-foreground/80 text-base md:text-lg">
                  {project.description.map((paragraph, index) => (
                    <li key={index}>{paragraph}</li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
