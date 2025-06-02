import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "IoT Device Automation System",
    description: [
      "Developed a modular low-power IoT ecosystem using ESP-IDF and AWS IoT, enabling app-controlled, non-invasive automation of appliances and industrial machines.",
      "Designed scalable IoT modules with SPI/I2C interfaces for retrofitting industrial systems, enabling sensor/actuator integration.",
      "Built a Flutter-based mobile interface for real-time AWS IoT connectivity, enabling users to create and trigger low-latency automation workflows.",
      "Integrated a serverless backend using AWS Lambda, API Gateway, and DynamoDB for device registration and data management.",
      "Implemented multi-mode deep sleep power management, extending battery life by up to 3x."
    ],
    image: "https://placehold.co/600x338.png",
    imageHint: "iot circuit",
    link: "#", // Placeholder link
  },
  {
    title: "STM32 Function Generator",
    description: [
      "Developed STM32F4 firmware for a function generator supporting sine, square, and triangle waveforms using optimized LUTs, achieving high signal fidelity across 1Hz–300kHz output range.",
      "Leveraged DMA with DAC and timer peripherals to enable precise, real-time waveform control.",
      "Enabled USB CDC interface for live waveform parameter tuning and system diagnostics."
    ],
    image: "https://placehold.co/600x338.png",
    imageHint: "signal waveform",
    link: "#",
  },
  {
    title: "ATMEGA328 MCU Data Logger",
    description: [
      "Designed a compact double-layer PCB using KiCad with ATMEGA328, 512KB EEPROM, and RTC for high-frequency sensor data logging.",
      "Reduced PCB footprint by 60% compared to Arduino Uno R3 by eliminating USB interface and optimizing component layout.",
      "Applied passive thermal management strategies for stable operation during prolonged high-load data logging."
    ],
    image: "https://placehold.co/600x338.png",
    imageHint: "pcb design",
    link: "#",
  },
  {
    title: "Dynamic Wireless Charging Roads Simulation",
    description: [
      "Led a 3-member research team to design industry standard-compliant EV wireless charging lanes for NYC’s 42nd Street.",
      "Built a full-stack simulation pipeline: SUMO for traffic flow, MATLAB for energy transfer, and Python for cost modeling.",
      "Demonstrated 10% SOC gain per hour in stop-and-go traffic and 2x range increase at 60 mph.",
      "Project recognized as “Most Innovative Idea” at the 2025 NYIT UREP Symposium."
    ],
    image: "https://placehold.co/600x338.png",
    imageHint: "electric vehicle charging",
    link: "#",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto">
        <h2 className="font-headline text-4xl font-bold text-center mb-12 text-primary">
          <Code className="inline-block h-10 w-10 mr-3" />
          Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-56">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  layout="fill" 
                  objectFit="cover"
                  data-ai-hint={project.imageHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                  {project.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild disabled={project.link === "#"}>
                  <Link href={project.link} target="_blank" rel="noopener noreferrer">
                    View Project <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
