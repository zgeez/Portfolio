import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Download } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const shortBio = "Driven Electrical and Computer Engineering student with a passion for software development, IoT, and embedded systems, leveraging skills in C/C++, Python, and cloud technologies to build innovative solutions.";
  
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-primary">
          Ziad Ghanem
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto">
          {shortBio}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10 text-foreground/70">
          <span className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" /> zghanema@gmail.com
          </span>
          <span className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-accent" /> 347-671-9188
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" /> New York, NY
          </span>
        </div>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="mailto:zghanema@gmail.com">
              <Mail className="mr-2 h-5 w-5" /> Say Hello
            </Link>
          </Button>
          <Button size="lg" variant="secondary" disabled>
            <Download className="mr-2 h-5 w-5" /> Download Resume
          </Button>
        </div>
      </div>
    </section>
  );
}
