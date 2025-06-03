import Link from 'next/link';
import { Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'ALL PROJECTS' },
];

export default function Header() {
  // In a real app, you'd use the router to determine the active path.
  // For this prototype, "ALL PROJECTS" will always be active as it's the only link.
  const currentPage = 'ALL PROJECTS';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center"> {/* Reduced height from h-28 to h-20 */}
        {/* Invisible spacer to balance the social icons on the right, ensuring central content is truly centered */}
        <div className="flex-1"></div>

        {/* Central content: Nav */}
        <div className="flex flex-1 flex-col items-center justify-center py-4">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`uppercase tracking-wider transition-colors hover:text-primary ${
                  link.label === currentPage ? 'text-accent font-bold' : 'text-foreground/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right-aligned Social Icons */}
        <div className="flex flex-1 justify-end items-center space-x-1">
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
