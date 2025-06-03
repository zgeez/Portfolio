import Link from 'next/link';
import { Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
        {/* Left-aligned Name */}
        <div className="flex-1">
          <a href="mailto:zghanema@gmail.com" className="text-2xl font-bold text-primary hover:text-accent transition-colors uppercase tracking-wider">
            Ziad Ghanem
          </a>
        </div>

        {/* Right-aligned Social Icons */}
        <div className="flex justify-end items-center space-x-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-foreground/70 hover:text-primary" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5 text-foreground/70 hover:text-primary" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
