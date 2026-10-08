'use client';

import Image from 'next/image';
import { Expand, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { EvidenceKind } from './types';

export type EvidenceFigureProps = { src: string; alt: string; width: number; height: number; caption?: ReactNode; className?: string; imgClassName?: string; priority?: boolean; kind?: EvidenceKind };

export function EvidenceFigure({ src, alt, width, height, caption, className, imgClassName, priority, kind = 'Project evidence' }: EvidenceFigureProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  // Keep the figure's background while showing the entire original in the dialog.
  const expandedImageClassName = cn(imgClassName, 'dossier-lightbox-image aspect-auto object-contain');
  useEffect(() => setEnhanced(true), []);
  return <figure className={cn('dossier-evidence-stage', className)}>
    <div className="dossier-evidence-toolbar"><span><i aria-hidden />{kind}</span><button hidden={!enhanced} type="button" aria-label={`Expand image: ${alt}`} onClick={() => dialog.current?.showModal()}><Expand size={15} aria-hidden /> Expand</button></div>
    <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 75vw, 60vw" className={cn('dossier-evidence-image', imgClassName)} />
    {caption && <figcaption><span className="dossier-figure-mark">FIG.</span><div>{caption}</div></figcaption>}
    <dialog ref={dialog} className="dossier-lightbox" aria-label={`Expanded image: ${alt}`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div><div className="dossier-lightbox-heading"><p>{kind}</p><button type="button" aria-label="Close expanded evidence" onClick={() => dialog.current?.close()}><X size={22} aria-hidden /></button></div><Image src={src} alt={alt} width={width} height={height} sizes="95vw" className={expandedImageClassName} />{caption && <div className="dossier-lightbox-caption">{caption}</div>}</div></dialog>
  </figure>;
}
