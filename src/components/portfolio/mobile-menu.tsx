'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

type Props = {
  items: { href: string; label: string }[];
  github: string;
  resume: string;
};

export function MobileMenu({ items, github, resume }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted hover:text-fg"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>
      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!open}
        className="absolute inset-x-0 top-[var(--header-h)] border-b border-line bg-bg/95 backdrop-blur-md"
      >
        <ul className="container flex flex-col py-2">
          {items.map((n) => (
            <li key={n.href}>
              <Link href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-fg">
                {n.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 flex gap-3 border-t border-line pb-2 pt-4">
            <a href={github} target="_blank" rel="noopener noreferrer" className="flex min-h-11 flex-1 items-center justify-center rounded-md border border-line text-sm text-muted">
              GitHub
            </a>
            <a href={resume} target="_blank" rel="noopener noreferrer" className="flex min-h-11 flex-1 items-center justify-center rounded-md border border-accent/50 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              Resume
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
