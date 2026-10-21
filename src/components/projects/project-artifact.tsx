import Image from 'next/image';
import { KineticDisplay } from '@/components/bench/objects/kinetic-display';
import { Stm32Board, EegRig } from '@/components/bench/objects/circuit-boards';
import { Equipment } from '@/components/bench/objects/equipment';
import type { ProjectArtifact as ArtifactType } from '@/data/project-dossiers';
import type { Project } from '@/data/projects';

function ArtifactIllustration({ type, project }: { type: ArtifactType; project: Project }) {
  if (type === 'badge') return <Equipment type="badge" />;
  if (type === 'board') return <Stm32Board />;
  if (type === 'eeg') return <EegRig />;
  if (type === 'waypoint') return <Equipment type="waypoint" />;
  if (type === 'app') return <div className="dossier-phone-artifact"><div className="dossier-phone-speaker" /><Image src={project.thumb} alt="" width={220} height={450} sizes="200px" priority /><span /></div>;
  if (type === 'study') return <div className="dossier-study-artifact"><p>42ND STREET / FEASIBILITY STUDY</p><Image src={project.thumb} alt="" width={400} height={280} sizes="350px" priority /><span>TRAFFIC → POWER → COST</span></div>;
  if (type === 'kinetic') return <KineticDisplay />;
  if (type === 'camera') return <svg viewBox="0 0 340 210" aria-hidden>
    <rect x="18" y="45" width="230" height="142" rx="5" fill="#174c3b" /><rect x="18" y="37" width="230" height="142" rx="5" fill="#347c58" stroke="#83a17f" strokeWidth="2" />
    <rect x="88" y="88" width="62" height="58" fill="#b9c1b9" stroke="#d5dad1" /><rect x="181" y="65" width="65" height="39" fill="#b1baba" /><rect x="181" y="120" width="65" height="45" fill="#aeb7b7" />
    <rect x="34" y="46" width="141" height="19" fill="#1c2921" />{Array.from({ length: 15 }, (_, i) => <rect key={i} x={39 + i * 9} y="52" width="3" height="5" fill="#c3b78c" />)}
    <path d="M163 122 C198 199 254 174 277 135" fill="none" stroke="#b9bba9" strokeWidth="16" /><path d="M163 122 C198 199 254 174 277 135" fill="none" stroke="#858f86" strokeWidth="1" />
    <rect x="257" y="43" width="64" height="103" rx="3" fill="#354d41" stroke="#8b9d84" /><circle cx="289" cy="84" r="25" fill="#152426" stroke="#768b84" strokeWidth="5" /><circle cx="289" cy="84" r="15" fill="#314e50" /><circle cx="284" cy="78" r="5" fill="#97b6ae" /><text x="98" y="169" fill="#b5c6b5" fontSize="7" letterSpacing="1">EDGE / INFERENCE / EVENTS</text>
  </svg>;
  return <svg viewBox="0 0 340 210" aria-hidden>
    <rect x="25" y="33" width="290" height="163" rx="7" fill="#141f24" /><rect x="25" y="22" width="290" height="163" rx="7" fill="#445555" stroke="#95a59b" strokeWidth="2" />
    <rect x="49" y="43" width="242" height="123" rx="3" fill="#46795e" stroke="#98aa8d" /><rect x="74" y="69" width="99" height="68" rx="2" fill="#aab6ac" stroke="#d1d7ca" /><rect x="83" y="79" width="47" height="36" fill="#273b35" />
    <path d="M138 84 h26 v7 h-19 v7 h19 v7 h-19" fill="none" stroke="#596e64" strokeWidth="3" />
    {[58, 138].map(y => <g key={y}>{Array.from({ length: 10 }, (_, i) => <rect key={i} x={74 + i * 10} y={y} width="4" height="7" fill="#bbb28c" />)}</g>)}
    <rect x="204" y="76" width="70" height="31" fill="#a8b388" stroke="#52684e" />{[213, 233, 253].map(x => <circle key={x} cx={x} cy="91" r="6" fill="#47594a" stroke="#d0d5b8" />)}
    <rect x="202" y="120" width="28" height="28" fill="#233930" /><circle cx="262" cy="143" r="4" fill="#a9ba8a" /><text x="91" y="176" fill="#b8c8b5" fontSize="7" letterSpacing="1">MODULAR NODE / MQTT</text>
  </svg>;
}

export function ProjectArtifact({ type, device, project }: { type: ArtifactType; device: string; project: Project }) {
  return <div className={`dossier-device-scene dossier-device-${type}`} aria-label={`${project.shortTitle ?? project.title}, angled workbench illustration`}>
    <div className="dossier-device-platform">
      <span className="dossier-platform-label">WORKBENCH / PROJECT {String(project.order).padStart(2, '0')}</span>
      <svg className="dossier-device-cables" viewBox="0 0 440 250" fill="none" aria-hidden><path d="M70 80 C-40 90 50 225 125 205 M375 90 C460 145 290 240 410 236" stroke="#141a1c" strokeWidth="7" /><path d="M70 80 C-40 90 50 225 125 205 M375 90 C460 145 290 240 410 236" stroke="#64716e" strokeWidth="2" /></svg>
      <div className="dossier-artifact"><ArtifactIllustration type={type} project={project} /></div>
      <span className="dossier-platform-footer">{device}</span>
    </div>
    <span className="dossier-device-caption">{String(project.order).padStart(2, '0')} — {type === 'app' ? 'Interface preview' : type === 'study' ? 'Study preview' : 'Illustrated hardware'}. On the bench.</span>
  </div>;
}
