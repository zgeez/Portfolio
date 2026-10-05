import { Github, Linkedin, Mail } from 'lucide-react';
import { site } from '@/data/site';
import { Wordmark } from './header';

export function ContactFooter() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="border-t border-line bg-bg-elevated">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr] md:py-20">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="section-title mt-2">Let’s talk firmware.</h2>
          <p className="mt-3 max-w-md text-muted">
            Open to embedded and firmware engineering roles. The fastest way to reach me is email.
          </p>
          <a href={`mailto:${site.email}`} className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-lg text-accent hover:text-accent-strong">
            <Mail className="h-5 w-5" aria-hidden />
            {site.email}
          </a>
        </div>
        <div className="flex flex-col gap-3 text-sm md:items-end md:justify-end">
          <ul className="flex flex-wrap gap-2 md:justify-end">
            <li>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="chip min-h-10 gap-2 px-3 hover:text-fg">
                <Github className="h-4 w-4" aria-hidden /> GitHub
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="chip min-h-10 gap-2 px-3 hover:text-fg">
                <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
              </a>
            </li>
            <li>
              <a href={site.resume} target="_blank" rel="noopener noreferrer" className="chip min-h-10 border-accent/40 px-3 text-accent hover:text-accent-strong">
                Resume (PDF)
              </a>
            </li>
          </ul>
          <p className="font-mono text-xs text-dim">{site.location}</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-dim">
          <Wordmark />
          <p>© {year} {site.name}. Static site, no trackers.</p>
        </div>
      </div>
    </footer>
  );
}
