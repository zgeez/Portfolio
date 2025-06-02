import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Cpu, Database, GitFork, HardDrive, Terminal, Wifi, Wrench } from "lucide-react";

const skillsData = [
  {
    category: "Programming",
    icon: <CheckCircle className="h-5 w-5 mr-2 text-primary" />,
    items: ["C/C++", "Python", "SQL", "Bash", "Java", "C#", "HTML/CSS/JS", "MATLAB"],
  },
  {
    category: "Hardware & Testing",
    icon: <Cpu className="h-5 w-5 mr-2 text-primary" />,
    items: ["ESP32", "MSP430", "STM32", "Raspberry Pi", "Arduino", "ARM Cortex-M", "Lab Equipment"],
  },
  {
    category: "Software/Frameworks",
    icon: <HardDrive className="h-5 w-5 mr-2 text-primary" />,
    items: ["FreeRTOS", "Linux", "CMake", "Git", "Jira", "Eclipse", "AWS", "GCP", "KiCad", "Altium"],
  },
  {
    category: "Protocols",
    icon: <Wifi className="h-5 w-5 mr-2 text-primary" />,
    items: ["Serial (SPI, I2C, UART, USB)", "Wireless (Wi-Fi, BLE)", "MQTT", "HTTP/HTTPS"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto">
        <h2 className="font-headline text-4xl font-bold text-center mb-12 text-primary">
          <Wrench className="inline-block h-10 w-10 mr-3" />
          Skills
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {skillsData.map((skillCategory, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader className="flex flex-row items-center">
                {skillCategory.icon}
                <CardTitle className="text-xl font-semibold text-primary">{skillCategory.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillCategory.items.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-sm px-3 py-1 bg-accent/30 text-accent-foreground hover:bg-accent/50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
