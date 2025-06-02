import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const educationHistory = [
  {
    degree: "Master of Science in Electrical and Computer Engineering (Accelerated Program)",
    institution: "New York Institute of Technology – New York, NY",
    period: "Expected May 2027",
    details: "Relevant Coursework: Microprocessors & Embedded Systems, Control Systems, Operating Systems, Data Structures",
  },
  {
    degree: "Bachelor of Science in Electrical and Computer Engineering with Honors",
    institution: "New York Institute of Technology – New York, NY",
    period: "Expected May 2026",
    details: "", // Already covered in MS
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="font-headline text-4xl font-bold text-center mb-12 text-primary">
          <GraduationCap className="inline-block h-10 w-10 mr-3" />
          Education
        </h2>
        <div className="space-y-8">
          {educationHistory.map((edu, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">{edu.degree}</CardTitle>
                <CardDescription className="text-md text-foreground/80">{edu.institution} | {edu.period}</CardDescription>
              </CardHeader>
              {edu.details && (
                <CardContent>
                  <p className="text-sm text-foreground/70">{edu.details}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
