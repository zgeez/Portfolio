import Link from 'next/link';
import { Linkedin, Github, Briefcase, User, Code, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '#about', label: 'About', icon: <User className="h-4 w-4" /> },
  { href: '#experience', label: 'Experience', icon: <Briefcase className="h-4 w-4" /> },
  { href: '#projects', label: 'Projects', icon: <Code className="h-4 w-4" /> },
  { href: '#education', label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
  { href: '#skills', label: 'Skills', icon: <Code className="h-4 w-4" /> },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold sm:inline-block text-primary">
            Ziad Ghanem
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-primary text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://www.linkedin.com/in/ziad-ghanem/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-foreground/80 hover:text-primary" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com/zgeez" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5 text-foreground/80 hover:text-primary" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
