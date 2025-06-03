import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export interface Project {
  slug: string;
  title: string;
  description: string[];
  image: string;
  imageHint: string;
}

export const projects: Project[] = [
  {
    slug: "iot-device-automation",
    title: "IoT Device Automation System",
    description: [
      "Developed a modular low-power IoT ecosystem using ESP-IDF and AWS IoT, enabling app-controlled, non-invasive automation of appliances and industrial machines.",
      "Designed scalable IoT modules with SPI/I2C interfaces for retrofitting industrial systems, enabling sensor/actuator integration.",
      "Built a Flutter-based mobile interface for real-time AWS IoT connectivity, enabling users to create and trigger low-latency automation workflows.",
      "Integrated a serverless backend using AWS Lambda, API Gateway, and DynamoDB for device registration and data management.",
      "Implemented multi-mode deep sleep power management, extending battery life by up to 3x."
    ],
    image: "https://placehold.co/400x300.png",
    imageHint: "iot circuit",
  },
  {
    slug: "stm32-function-generator",
    title: "STM32 Function Generator",
    description: [
      "Developed STM32F4 firmware for a function generator supporting sine, square, and triangle waveforms using optimized LUTs, achieving high signal fidelity across 1Hz–300kHz output range.",
      "Leveraged DMA with DAC and timer peripherals to enable precise, real-time waveform control.",
      "Enabled USB CDC interface for live waveform parameter tuning and system diagnostics."
    ],
    image: "https://placehold.co/400x300.png",
    imageHint: "signal waveform",
  },
  {
    slug: "nyc-dynamic-wireless-charging-roads",
    title: "NYC Dynamic Wireless Charging Roads Simulation",
    description: [
      "Team Lead: Led a 3-member research team to design industry standard-compliant EV wireless charging lanes for NYC’s 42nd Street, delivering a tested simulation model for real-time urban charging feasibility.",
      "Built a full-stack simulation pipeline: SUMO for traffic flow, MATLAB for energy transfer, and Python for cost modeling.",
      "Demonstrated 10% SOC gain per hour in stop-and-go traffic and 2x range increase at 60 mph through system simulation.",
      "Project recognized as “Most Innovative Idea” by a panel of industry professionals at the 2025 NYIT UREP Symposium.",
    ],
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
