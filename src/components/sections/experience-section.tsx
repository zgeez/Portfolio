import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    role: "Software Engineer",
    company: "Self-Employed – Remote",
    period: "May 2024 - December 2024",
    description: [
      "Engineered cross-platform mobile solutions using Flutter and Google Cloud for healthcare providers, chefs, and automation clients, enabling them to streamline operations and boost user engagement.",
      "Built Firebase dashboards with authentication, role-based content control, and integrated analytics via Google Analytics, reducing manual entry by 40% and enabling real-time engagement tracking.",
      "Designed intuitive and customizable UI/UX using Google’s Material Design, for features like automated patient record entry, smart scheduling, and personalized meal plans, enhancing user retention and engagement.",
      "Delivered end-to-end app support using Firebase Crashlytics and automated CI/CD pipelines, maintaining 99.9% uptime and ensuring rapid feature delivery and bug resolution.",
    ],
  },
  {
    role: "ERP System Developer Intern",
    company: "ProART Consulting – Maadi, Egypt",
    period: "July 2023 - September 2023",
    description: [
      "Built custom SSRS reports for Microsoft Dynamics ERP using SQL queries, improving sales data traceability and accelerating executive decision-making.",
      "Automated repetitive customer and inventory data entry tasks using SQL and X++, reducing manual processing time by 70% and significantly improving team throughput.",
      "Developed SQL-driven asset management procedures for acquisition tracking and real-time valuation, ensuring 100% accuracy in monthly financial reports and eliminating manual entry errors.",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="font-headline text-4xl font-bold text-center mb-12 text-primary">
          <Briefcase className="inline-block h-10 w-10 mr-3" />
          Experience
        </h2>
        <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border before:-translate-x-px md:before:mx-auto md:before:translate-x-0">
          {experiences.map((exp, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Briefcase className="h-5 w-5" />
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">{exp.role}</CardTitle>
                  <CardDescription className="text-md text-foreground/80">{exp.company} | {exp.period}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-foreground/70">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
