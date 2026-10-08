import type { CSSProperties, MouseEvent } from 'react';
import type { BenchObject as ObjectData } from '@/data/bench';
import { site } from '@/data/site';
import { Equipment } from './objects/equipment';

export function BenchObject({ object, selected, inspecting, onSelect }: { object: ObjectData; selected: boolean; inspecting: boolean; onSelect: (object: ObjectData, trigger: HTMLElement) => void }) {
  const style = {
    '--object-x': `${object.position.x}px`, '--object-y': `${object.position.y}px`,
    '--object-w': `${object.size.width}px`, '--object-h': `${object.size.height}px`,
    '--object-rotation': `${object.rotation}deg`,
    '--mobile-x': `${object.mobile.x}px`, '--mobile-y': `${object.mobile.y}px`,
    '--mobile-w': `${object.mobile.width}px`, '--mobile-h': `${object.mobile.height}px`,
  } as CSSProperties;
  const content = <><div className="bench-equipment" aria-hidden="true"><Equipment type={object.type} /></div><span className="bench-object-caption"><strong>{object.label}</strong><span>{object.subtitle}</span></span></>;
  const className = `bench-object bench-${object.type} bench-${object.layer}${selected ? ' is-selected' : ''}${inspecting && !selected ? ' is-muted' : ''}`;
  // Focused camera states can place other objects outside the viewport.
  // Keep those out of Tab order until Back/Escape restores the overview.
  const tabIndex = inspecting && !selected ? -1 : 0;
  if (object.type === 'resume') return <a data-object={object.id} className={className} style={style} tabIndex={tabIndex} href={site.resume} target="_blank" rel="noopener noreferrer" aria-label="Open current resume PDF in a new tab">{content}</a>;
  return <button data-object={object.id} className={className} style={style} tabIndex={tabIndex} aria-label={`${object.label}: ${object.subtitle}. Inspect`} aria-pressed={selected} aria-controls={inspecting ? 'bench-inspection' : undefined} onClick={(event: MouseEvent<HTMLButtonElement>) => onSelect(object, event.currentTarget)}>{content}</button>;
}
