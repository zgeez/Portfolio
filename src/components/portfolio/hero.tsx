import Link from 'next/link';
import { ArrowDown, Github, Linkedin } from 'lucide-react';
import { site } from '@/data/site';
import { HeroSystemSketch } from './hero-system-sketch';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_40%,black,transparent)]"
      />
      <div className="container relative grid grid-cols-1 items-center gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-16">
        <div>
          <p className="eyebrow">{site.role}</p>
          <h1 id="hero-title" className="mt-4 text-5xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl">
            {site.name}
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted sm:text-2xl">{site.tagline}</p>
          <p className="mt-6 font-mono text-sm text-dim">
            {site.stack.map((s, i) => (
              <span key={s}>
                {i > 0 && (
                  <>
                    {' '}
                    <span aria-hidden className="mx-1 text-line-strong">·</span>{' '}
                  </>
                )}
                <span className="whitespace-nowrap text-muted">{s}</span>
              </span>
            ))}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/#systems"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-5 font-medium text-bg transition-colors hover:bg-accent-strong"
            >
              Explore Systems
              <ArrowDown className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-md border border-line-strong px-5 font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent"
            >
              Resume
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex h-12 w-12 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
            >
              <Github className="h-5 w-5" aria-hidden />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex h-12 w-12 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
            >
              <Linkedin className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>
        <HeroSystemSketch />
      </div>
    </section>
  );
}
