import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { inspections, type BenchTarget } from '@/data/bench';
import { InspectionContent } from './inspection-content';

export function InspectionOverlay({ target, onClose, onSelect }: { target: BenchTarget; onClose: () => void; onSelect: (target: BenchTarget, trigger: HTMLElement) => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const inspection = inspections[target];
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [target]);
  return <aside id="bench-inspection" className="bench-inspection" role="dialog" aria-modal="false" aria-labelledby="bench-inspection-title">
    <div className="inspection-header"><div className="inspection-top"><span>{inspection.projectSlug ? 'Project inspection' : 'On the bench'}</span><button onClick={onClose} aria-label="Close inspection and return to bench">×</button></div>
      <h2 id="bench-inspection-title" ref={heading} tabIndex={-1}>{inspection.title}</h2>
      {inspection.description && <p className="inspection-description">{inspection.description}</p>}
      {inspection.projectSlug && <Link className="inspection-link" href={inspection.href!}>{inspection.linkLabel} →</Link>}
    </div>
    <div className="inspection-body"><InspectionContent target={target} onSelect={onSelect} /></div>
    <div className="inspection-footer"><button className="back-to-bench" onClick={onClose}>← Back to bench <kbd>Esc</kbd></button></div>
  </aside>;
}
