'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ProjectChapter } from './types';

export function ChapterNavigation({ chapters, benchTarget }: { chapters: ProjectChapter[]; benchTarget: string }) {
  const router = useRouter();
  const [active, setActive] = useState(chapters[0]?.id);
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = chapters.map(chapter => document.getElementById(chapter.id)).filter((element): element is HTMLElement => !!element);
    let frame = 0;
    let anchor: { element: HTMLElement; reached: boolean } | null = null;
    const read = () => {
      frame = 0;
      // Native anchors combine the chapter's margin with the document's padding.
      // Include both so the rail agrees with direct links at every breakpoint.
      const margin = elements[0] ? parseFloat(getComputedStyle(elements[0]).scrollMarginTop) || 0 : 0;
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const offset = margin + padding + 24;
      let current = elements[0];
      for (const element of elements) if (element.getBoundingClientRect().top <= offset) current = element;
      const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      if (window.scrollY >= maximum - 2) current = elements.at(-1) ?? current;
      if (anchor) {
        const destination = Math.max(0, Math.min(maximum, window.scrollY + anchor.element.getBoundingClientRect().top - margin - padding));
        if (Math.abs(window.scrollY - destination) <= 2) {
          anchor.reached = true;
          current = anchor.element;
        } else if (anchor.reached) anchor = null;
      }
      if (current) setActive(current.id);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      const element = elements.find(element => element.id === id);
      anchor = element ? { element, reached: false } : null;
      if (chapters.some(chapter => chapter.id === id)) setActive(id);
      // Native fragments can create null history entries. Let Next own them so
      // Back/Forward across the bench and project routes restores the document.
      if (!window.history.state) router.replace(window.location.href, { scroll: false });
      onScroll();
    };
    fromHash();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', fromHash);
    window.addEventListener('popstate', fromHash);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); window.removeEventListener('hashchange', fromHash); window.removeEventListener('popstate', fromHash); };
  }, [chapters, router]);

  useEffect(() => {
    const reveal = () => {
      const nav = navigation.current;
      if (!nav || innerWidth > 700) return;
      const link = nav.querySelector<HTMLElement>('[aria-current]');
      if (!link) return;
      const left = link.offsetLeft;
      if (left < nav.scrollLeft || left + link.offsetWidth > nav.scrollLeft + nav.clientWidth) nav.scrollTo({ left: Math.max(0, left - 24), behavior: 'auto' });
    };
    reveal();
    window.addEventListener('resize', reveal);
    return () => window.removeEventListener('resize', reveal);
  }, [active]);

  return <nav ref={navigation} className="dossier-chapters" aria-label="Project chapters">
    <p className="dossier-label">Inside the build</p>
    {chapters.map(({ id, label }, index) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setActive(id)}><span>{String(index + 1).padStart(2, '0')}</span>{label}<ArrowRight size={13} aria-hidden /></a>)}
    <Link className="dossier-rail-return" href={`/#${benchTarget}`}><ArrowLeft size={13} aria-hidden /> Back to workbench</Link>
  </nav>;
}
