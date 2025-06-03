
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export interface Project {
  slug: string;
  title: string;
  summary: string; // Short description for previews and SEO
  image: string;
  imageHint: string;
}

export const projects: Project[] = [
  {
    slug: "iot-device-automation",
    title: "IoT Device Automation System",
    summary: "A versatile and energy-efficient IoT ecosystem using ESP-IDF and AWS IoT for app-controlled automation of appliances and industrial machines.",
    image: "https://placehold.co/400x300.png",
    imageHint: "iot circuit",
  },
  {
    slug: "stm32-function-generator",
    title: "STM32 Function Generator",
    summary: "Development of a high-fidelity function generator using an STM32F4 microcontroller, supporting multiple waveforms with DMA and USB control.",
    image: "https://placehold.co/400x300.png",
    imageHint: "signal waveform",
  },
  {
    slug: "nyc-dynamic-wireless-charging-roads",
    title: "NYC Dynamic Wireless Charging Roads Simulation",
    summary: "Led research for NYC EV wireless charging lanes, developing a simulation model demonstrating real-time charging feasibility and recognized for innovation.",
    image: "https://placehold.co/400x300.png",
    imageHint: "wireless charging road",
  }
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="pt-8 md:pt-12 pb-16 md:pb-24 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-primary inline-block uppercase tracking-wider">
            Projects
          </h2>
          <div className="w-20 h-px bg-foreground mx-auto mt-3"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
              <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col border-transparent hover:border-primary/50">
                <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={project.imageHint}
                    className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4 text-center flex-grow flex flex-col justify-center">
                  <CardTitle className="text-md font-semibold text-foreground group-hover:text-accent uppercase tracking-wide">
                    {project.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
