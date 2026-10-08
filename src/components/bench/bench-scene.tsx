'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BENCH, benchObjects, inspections, MOBILE_BENCH, targetFromHash, type BenchTarget, type BenchObject as ObjectData } from '@/data/bench';
import { projects } from '@/data/projects';
import { site } from '@/data/site';
import { BenchCamera, cameraFor, type ViewSize } from './bench-camera';
import { BenchObject } from './bench-object';
import { BenchCables } from './bench-cables';
import { BenchDock } from './bench-dock';
import { InspectionOverlay } from './inspection-overlay';
import './bench.css';

type Selection = { target: BenchTarget | null; objectId?: string };

export function BenchScene() {
  const router = useRouter();
  const viewport = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const lastObject = useRef<string | undefined>();
  const [size, setSize] = useState<ViewSize>({ width: 1440, height: 900 });
  const [selection, setSelection] = useState<Selection>({ target: null });
  const angle = BENCH.angle;
  const mobile = size.width < 768;
  const active = selection.target;
  const selectedObject = active ? benchObjects.find((object) => object.id === selection.objectId && (object.target === active || object.id === inspections[active].focusObject)) ?? benchObjects.find((object) => object.id === inspections[active].focusObject || object.target === active) : undefined;

  useEffect(() => { if (selectedObject) lastObject.current = selectedObject.id; }, [selectedObject]);

  const returnFocus = useCallback(() => {
    const object = benchObjects.find((item) => item.id === lastObject.current);
    const fallback = object ? viewport.current?.querySelector<HTMLElement>(`[data-object="${object.id}"]`) : viewport.current;
    (lastTrigger.current?.isConnected ? lastTrigger.current : fallback)?.focus({ preventScroll: true });
    if (window.matchMedia('(max-width: 767px)').matches) viewport.current?.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, []);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const navigate = useCallback((target: BenchTarget | null, trigger?: HTMLElement, objectId?: string) => {
    if (trigger) lastTrigger.current = trigger;
    const hash = target ? `#${target}` : '';
    // Next's native-history bridge copies its routing state and updates its URL.
    // Passing only our fields keeps that bridge active.
    if (window.location.hash !== hash || window.history.state?.benchObject !== objectId) {
      const url = new URL(window.location.href);
      url.hash = hash;
      window.history.pushState({ benchObject: objectId }, '', url.href);
    }
    setSelection({ target, objectId });
    if (!target) {
      returnFocus();
    }
  }, [returnFocus]);

  useEffect(() => {
    const readHash = () => {
      const target = targetFromHash(window.location.hash);
      if (!target && window.location.hash) {
        const overviewUrl = new URL(window.location.href);
        overviewUrl.hash = '';
        router.replace(overviewUrl.href, { scroll: false });
      } else if (!window.history.state) {
        // Native fragment navigation can create an entry with null state.
        // Give that entry to Next so Back from a case study can restore this route.
        router.replace(window.location.href, { scroll: false });
      }
      setSelection({ target, objectId: window.history.state?.benchObject });
      if (target && !lastTrigger.current) lastTrigger.current = viewport.current?.querySelector<HTMLElement>(`[data-object="${target}"]`) ?? viewport.current;
      if (!target && lastObject.current) returnFocus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && targetFromHash(window.location.hash)) { event.preventDefault(); navigate(null); }
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    window.addEventListener('popstate', readHash);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('hashchange', readHash);
      window.removeEventListener('popstate', readHash);
      window.removeEventListener('keydown', onKey);
    };
  }, [navigate, returnFocus, router]);

  useEffect(() => {
    if (!mobile || !selectedObject) return;
    const element = viewport.current;
    if (!element) return;
    const ratio = size.width / MOBILE_BENCH.width;
    const panel = element.closest('.bench-workspace')?.querySelector('.bench-inspection');
    const availableHeight = panel ? panel.getBoundingClientRect().top - element.getBoundingClientRect().top : size.height * 0.44;
    const top = (selectedObject.mobile.y + selectedObject.mobile.height / 2) * ratio - Math.max(0, availableHeight / 2);
    element.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [mobile, selectedObject, size]);

  const selectObject = (object: ObjectData, trigger: HTMLElement) => navigate(object.target ?? null, trigger, object.id);

  return <section className={`bench-workspace${active ? ' is-inspecting' : ''}`} aria-label="Embedded engineering workbench">
    <a className="bench-skip" href="#bench-navigation" onClick={(event) => { event.preventDefault(); navigate(null); document.getElementById('bench-navigation')?.focus({ preventScroll: true }); }}>Skip to navigation</a>
    <h1 className="sr-only">{site.name} — {site.role}. Workbench.</h1>
    <header className="bench-identity"><Link href="/" onClick={(event) => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); navigate(null, event.currentTarget); } }}>{site.name}</Link><p>{site.role}</p></header>
    <div className="bench-viewport" ref={viewport} tabIndex={0} aria-label="Engineering desk. Tab to an object and press Enter to inspect. On mobile, scroll to explore.">
      <BenchCamera camera={cameraFor(size, angle, selectedObject)} angle={angle} mobile={mobile} size={size}>
        <div className="bench-desk-mark" aria-hidden="true">WORKBENCH</div>
        <BenchCables />
        {(mobile ? [...benchObjects].sort((a, b) => a.mobile.y - b.mobile.y) : benchObjects).map((object) => <BenchObject key={object.id} object={object} selected={selectedObject?.id === object.id} inspecting={!!active} onSelect={selectObject} />)}
      </BenchCamera>
    </div>
    {active && <InspectionOverlay key={active} target={active} onClose={() => navigate(null)} onSelect={(target, trigger) => navigate(target, trigger)} />}
    <p className="bench-hint">{active ? 'Select another object, or return to the bench.' : 'Select an object to inspect · Tab to explore'}</p>
    <BenchDock active={active} onSelect={navigate} />
    <noscript><div className="bench-noscript"><h2>Explore Ziad’s portfolio</h2><p>The interactive desk needs JavaScript. Read the full projects below.</p><ul>{projects.map((project) => <li key={project.slug}><Link href={`/projects/${project.slug}/`}>{project.title}</Link></li>)}</ul><a href={site.resume}>Resume PDF</a></div></noscript>
    <span className="sr-only" role="status">{active ? `${active} inspection open` : 'Full bench overview'}</span>
  </section>;
}
