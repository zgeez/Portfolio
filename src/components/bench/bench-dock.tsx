import { site } from '@/data/site';
import type { BenchTarget } from '@/data/bench';

export function BenchDock({ active, onSelect }: { active: BenchTarget | null; onSelect: (target: BenchTarget | null, trigger: HTMLElement) => void }) {
  return <nav id="bench-navigation" className="bench-dock" aria-label="Bench shortcuts" tabIndex={-1}>
    <button onClick={(event) => onSelect(null, event.currentTarget)} aria-pressed={!active}>Bench</button>
    <button onClick={(event) => onSelect('projects', event.currentTarget)} aria-pressed={active === 'projects'}>Projects</button>
    <button onClick={(event) => onSelect('experience', event.currentTarget)} aria-pressed={active === 'experience'}>Experience</button>
    <a href={site.resume} target="_blank" rel="noopener noreferrer">Resume<span className="sr-only"> PDF, new tab</span></a>
    <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only">, new tab</span></a>
    <button onClick={(event) => onSelect('contact', event.currentTarget)} aria-pressed={active === 'contact'}>Contact</button>
  </nav>;
}
