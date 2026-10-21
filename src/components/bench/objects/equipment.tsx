import Image from 'next/image';
import { asset } from '@/data/site';
import type { BenchKind } from '@/data/bench';
import { EegRig, Stm32Board } from './circuit-boards';
import { JtagDebugger, LogicAnalyzer } from './debug-tools';
import { KineticDisplay } from './kinetic-display';

export function Equipment({ type }: { type: BenchKind }) {
  if (type === 'badge') return <Image src={asset('assets/pixel-badge/badge-board.svg')} alt="" width={440} height={280} sizes="(max-width: 767px) 65vw, 300px" className="bench-svg" data-device="pixel-badge" />;
  if (type === 'scope') return (
    <div className="scope-equipment">
      <div className="scope-top"><div className="scope-handle" /><div className="scope-vents">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div></div>
      <div className="scope-front">
        <div className="scope-screen">
          <Image src={asset('assets/stm32-msi/workspace.png')} alt="" width={2450} height={1575} className="scope-capture" sizes="400px" />
          <span className="scope-caption">CH 1 · ANALOG CAPTURE</span>
        </div>
        <div className="scope-controls">
          <span className="equipment-heading">OSCILLOSCOPE</span>
          <span className="scope-knob scope-knob-large" />
          <div className="knob-row"><span className="scope-knob" /><span className="scope-knob" /></div>
          <div className="scope-softkeys">{Array.from({ length: 4 }, (_, i) => <i key={i} />)}</div>
          <div className="scope-sockets"><i /><i /></div><div className="scope-channel-labels"><span>CH 1</span><span>CH 2</span></div>
        </div>
      </div>
      <div className="scope-feet"><i /><i /></div>
    </div>
  );
  if (type === 'board') return <Stm32Board />;
  if (type === 'eeg') return <EegRig />;
  if (type === 'jtag') return <JtagDebugger />;
  if (type === 'logic') return <LogicAnalyzer />;
  if (type === 'kinetic') return <KineticDisplay />;
  if (type === 'waypoint') return (
    <svg viewBox="0 0 270 270" className="bench-svg" data-device="waypoint-ring">
      <circle cx="135" cy="144" r="116" fill="#797e79" />
      <circle cx="135" cy="132" r="116" fill="#cfd3c9" stroke="#e1e3d9" strokeWidth="2" />
      <circle cx="135" cy="132" r="105" fill="none" stroke="#b3bab0" strokeWidth="1" />
      <circle cx="135" cy="132" r="100" fill="none" stroke="#e9ebde" strokeWidth="2" />
      {[45,135,225,315].map(degrees => { const a=degrees*Math.PI/180; const x=135+Math.cos(a)*105; const y=132+Math.sin(a)*105; return <g key={degrees}><circle cx={x} cy={y} r="3" fill="#879487" /><path d={`M${x-1.5} ${y} h3`} stroke="#dfe3ce" /></g>; })}
      <circle cx="135" cy="132" r="79" fill="none" stroke="#1a3437" strokeWidth="25" />
      {Array.from({ length: 16 }, (_, i) => {
        const angle = i * Math.PI / 8 - Math.PI / 2;
        const x = 135 + Math.cos(angle) * 79;
        const y = 132 + Math.sin(angle) * 79;
        return <g key={i} transform={`translate(${x} ${y}) rotate(${i * 22.5})`}><rect x="-8" y="-8" width="16" height="16" rx="1" fill="#d6d6c4" stroke="#9ca493" /><circle r="4" fill={i === 0 ? '#cb7968' : i === 5 ? '#83d1c3' : i === 4 || i === 6 ? '#759cac' : '#bbbca9'} /></g>;
      })}
      <text x="135" y="133" textAnchor="middle" fill="#647a70" fontSize="10" letterSpacing="2">WAYPOINT</text>
      <text x="135" y="151" textAnchor="middle" fill="#7c887d" fontSize="7" letterSpacing="1">16 PIXELS / BLE</text>
      <rect x="119" y="243" width="32" height="10" rx="2" fill="#7a8780" /><rect x="125" y="245" width="20" height="6" rx="2" fill="#243632" stroke="#a8b5a5" />
    </svg>
  );
  if (type === 'laptop') return (
    <div className="laptop-equipment">
      <div className="laptop-lid"><i className="laptop-webcam" /><div className="laptop-display"><div className="laptop-window-bar"><i /><i /><i /></div><span>RESEARCH & EXPERIENCE</span><b>NYIT</b><div className="laptop-window-lines"><i /><i /><i /></div><small>Firmware · Software · Research</small></div></div>
      <div className="laptop-base"><div className="laptop-keys">{Array.from({ length: 40 }, (_, i) => <i key={i} />)}</div><div className="laptop-trackpad" /></div>
      <i className="laptop-usb-port laptop-usb-first" /><i className="laptop-usb-port laptop-usb-second" />
    </div>
  );
  if (type === 'notebook') return (
    <div className="notebook-equipment"><div className="notebook-binding">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div><div className="notebook-page"><span>ZIAD GHANEM</span><b>Education &<br />Skills</b><i /><i /><small>Electrical & Computer Engineering</small></div><div className="notebook-pen" /></div>
  );
  if (type === 'resume') return (
    <div className="resume-equipment"><div className="paper-under" /><div className="resume-paper"><span>ZIAD GHANEM</span><b>RESUME</b>{Array.from({ length: 6 }, (_, i) => <i key={i} />)}<small>PDF ↗</small></div></div>
  );
  if (type === 'card') return <div className="contact-equipment"><span>ZIAD GHANEM</span><b>Embedded &<br />Firmware Engineer</b><i /><small>Let’s build something.</small><div className="contact-card-mark">ZG</div></div>;
  return <svg viewBox="0 0 390 170" className="bench-svg" data-device="parts-tray">
    <rect x="4" y="14" width="382" height="146" rx="10" fill="#192224" />
    <rect x="4" y="4" width="382" height="146" rx="10" fill="#465151" stroke="#82908a" strokeWidth="2" />
    {[14, 112, 210, 308].map((x, i) => <g key={x}><rect x={x} y="16" width={i === 3 ? 65 : 89} height="119" rx="4" fill="#263232" stroke="#637270" /><path d={`M${x + 5} 125 h${i === 3 ? 55 : 79}`} stroke="#1d2828" strokeWidth="4" /></g>)}
    <rect x="28" y="31" width="65" height="81" rx="3" fill="#c5cdc1" stroke="#83988a" />
    {[42,53,64,75,86,97].map(y => <g key={y}>{Array.from({length: 5}, (_,i) => <circle key={i} cx={38+i*10} cy={y} r="1.6" fill="#4a5d51" />)}</g>)}
    <path d="M31 38 V104 M90 38 V104" stroke="#997f77" strokeWidth="2" />
    <rect x="129" y="38" width="53" height="64" rx="2" fill="#4d735e" stroke="#84957a" /><rect x="139" y="51" width="31" height="29" fill="#243a2f" /><rect x="128" y="83" width="22" height="12" fill="#a5b0a4" />
    <circle cx="256" cy="70" r="28" fill="#192626" stroke="#657877" strokeWidth="5" /><circle cx="256" cy="70" r="15" fill="#2e4847" stroke="#819f9b" /><circle cx="251" cy="65" r="4" fill="#a4bbb1" />
    <g stroke="#a6ac8f" strokeWidth="3">{Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${321 + i * 9} 47 v31`} />)}</g>
    <rect x="317" y="75" width="42" height="28" rx="2" fill="#485953" stroke="#809087" />
  </svg>;
}
