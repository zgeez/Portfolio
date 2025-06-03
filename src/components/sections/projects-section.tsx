import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export interface Project {
  slug: string;
  title: string;
  description: string; // Changed from string[] to string for HTML content
  image: string;
  imageHint: string;
}

export const projects: Project[] = [
  {
    slug: "iot-device-automation",
    title: "IoT Device Automation System",
    description: "<p>This project focuses on creating a versatile and energy-efficient IoT ecosystem. Below are some key features and developments:</p><ul><li>Developed a modular low-power IoT ecosystem using ESP-IDF and AWS IoT, enabling app-controlled, non-invasive automation of appliances and industrial machines.</li><li>Designed scalable IoT modules with SPI/I2C interfaces for retrofitting industrial systems, enabling sensor/actuator integration.</li><li>Built a Flutter-based mobile interface for real-time AWS IoT connectivity, enabling users to create and trigger low-latency automation workflows.</li><li>Integrated a serverless backend using AWS Lambda, API Gateway, and DynamoDB for device registration and data management.</li><li>Implemented multi-mode deep sleep power management, extending battery life by up to 3x.</li></ul><p><em>You can add more HTML content here, including images like this:</em></p><img src='https://placehold.co/600x300.png' alt='IoT Module Example' data-ai-hint='iot module' class='my-4 rounded shadow-md' />",
    image: "https://placehold.co/400x300.png",
    imageHint: "iot circuit",
  },
  {
    slug: "stm32-function-generator",
    title: "STM32 Function Generator",
    description: "<h3>Overview</h3><p>This project involved the development of a high-fidelity function generator using an STM32F4 microcontroller.</p><h3>Key Features:</h3><ul><li>Developed STM32F4 firmware for a function generator supporting sine, square, and triangle waveforms using optimized Look-Up Tables (LUTs), achieving high signal fidelity across a 1Hz–300kHz output range.</li><li>Leveraged Direct Memory Access (DMA) with DAC and timer peripherals to enable precise, real-time waveform control.</li><li>Enabled USB CDC interface for live waveform parameter tuning and system diagnostics.</li></ul><p><em>Further details and component images can be added using HTML.</em></p>",
    image: "https://placehold.co/400x300.png",
    imageHint: "signal waveform",
  },
  {
    slug: "nyc-dynamic-wireless-charging-roads",
    title: "NYC Dynamic Wireless Charging Roads Simulation",
    description: "<h3>Role: Team Lead</h3><p>Led a 3-member research team to design industry standard-compliant EV wireless charging lanes for NYC’s 42nd Street, delivering a tested simulation model for real-time urban charging feasibility.</p><h3>Technical Stack &amp; Achievements:</h3><ul><li>Built a full-stack simulation pipeline: SUMO for traffic flow, MATLAB for energy transfer, and Python for cost modeling.</li><li>Demonstrated 10% SOC gain per hour in stop-and-go traffic and 2x range increase at 60 mph through system simulation.</li></ul><h3>Recognition:</h3><p>Project recognized as “Most Innovative Idea” by a panel of industry professionals at the 2025 NYIT UREP Symposium.</p><img src='https://placehold.co/600x350.png' alt='NYC Charging Lane Concept' data-ai-hint='urban charging concept' class='my-4 rounded shadow-md' />",
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
