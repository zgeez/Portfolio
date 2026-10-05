import Link from 'next/link';
import { Github } from 'lucide-react';
import { site } from '@/data/site';
import { MobileMenu } from './mobile-menu';

export const NAV = [
  { href: '/#systems', label: 'Systems' },
  { href: '/#research-experience', label: 'Research & Experience' },
  { href: '/#debug', label: 'Debugging' },
  { href: '/#more-systems', label: 'More Systems' },
  { href: '/#skills', label: 'Tools' },
  { href: '/#about', label: 'About' },
];

export function Wordmark() {
  return (
    <Link href="/" className="group inline-flex min-h-11 items-center font-semibold tracking-[0.2em] text-fg" aria-label={`${site.name}, home`}>
      ZIAD
      <span aria-hidden className="mx-1.5 inline-block h-4 w-px bg-accent transition-transform duration-200 group-hover:scale-y-125" />
      GHANEM
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-[var(--header-h)] border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <a
        href="#main"
        className="absolute left-4 top-2 z-50 -translate-y-20 rounded bg-accent px-3 py-2 text-sm font-medium text-bg focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="container flex h-full items-center justify-between gap-6">
        <Wordmark />
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-5 whitespace-nowrap text-sm text-muted">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-fg">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-2 xl:flex">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-muted transition-colors hover:text-fg"
          >
            <Github className="h-4 w-4" aria-hidden />
            GitHub
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center rounded-md border border-accent/50 px-3.5 font-mono text-xs uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/10"
          >
            Resume
          </a>
        </div>
        <MobileMenu items={NAV} github={site.github} resume={site.resume} />
      </div>
    </header>
  );
}
