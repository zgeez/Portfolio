// The printed rail, black sliding segments, magnets, and screw-core coils
// follow the assembled module photographed in the case study.
export function KineticDisplay() {
  const bars = [[44, 27, 67, 29], [25, 51, 29, 70], [101, 51, 29, 70], [44, 113, 67, 29], [25, 136, 29, 70], [101, 136, 29, 70], [44, 202, 67, 29]];
  const coils = [[246, 39], [202, 84], [291, 84], [246, 128], [202, 175], [291, 175], [246, 222]];
  return <svg viewBox="0 0 340 280" className="bench-svg" data-device="kinetic-seven-segment">
    <path d="M173 18 H322 V256 H173z" fill="#979f96" stroke="#bec7b8" strokeWidth="2" />
    <rect x="178" y="10" width="148" height="239" rx="3" fill="#d5d7cb" stroke="#ebede0" strokeWidth="3" />
    <rect x="188" y="21" width="128" height="217" fill="#233032" />
    <g fill="none" strokeWidth="2">
      <path d="M208 64 C215 150 190 244 263 234 M292 104 C294 208 225 202 212 234" stroke="#b79865" />
      <path d="M235 45 C228 120 278 227 308 238 M256 127 C275 180 221 205 201 235" stroke="#a87971" />
    </g>
    <g stroke="#bcc2b3" strokeWidth="7"><path d="M189 28 H313 M189 120 H313 M189 212 H313 M213 23 V236 M280 23 V236" /></g>
    {coils.map(([x,y], index) => <g key={index} transform={`translate(${x} ${y})`}>
      <ellipse cx="3" cy="4" rx="18" ry="15" fill="#858d81" />
      <rect x="-17" y="-12" width="35" height="22" rx="8" fill="#a27452" stroke="#684b37" />
      {Array.from({length: 8}, (_, i) => <path key={i} d={`M${-14 + i * 4} -9 v18`} stroke="#d0a374" strokeWidth="1.4" />)}
      <circle r="15" fill="#e0e0d2" stroke="#aeb6a6" strokeWidth="2" /><circle r="10" fill="#303638" /><circle r="5" fill="#a5b0a7" />
      <path d="M-3 0 H3 M0 -3 V3" stroke="#35403b" strokeWidth="2" />
    </g>)}
    <path d="M12 16 H149 V254 H12z" fill="#89968e" />
    <rect x="5" y="7" width="146" height="241" rx="3" fill="#dde0d2" stroke="#f2f1e4" strokeWidth="3" />
    <rect x="17" y="19" width="122" height="217" fill="#c1c7b7" stroke="#a3af9f" />
    {bars.map(([x,y,w,h], index) => <g key={index}>
      <rect x={x + 2} y={y + 3} width={w} height={h} rx="2" fill="#7f8a7b" />
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#232a2b" stroke="#404b46" />
      <circle cx={x+w/2} cy={y+h/2} r="5" fill="#ac9b76" stroke="#d0c09b" />
    </g>)}
    {[13,143].flatMap(x => [15,240].map(y => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="3" fill="#7e8b80" /><path d={`M${x-1.5} ${y} h3`} stroke="#dce1cc" /></g>))}
    <path d="M151 46 H172 M151 209 H172" stroke="#b9c4b1" strokeWidth="5" />
    <text x="248" y="267" textAnchor="middle" fill="#9faf9f" fontSize="7" letterSpacing="1.2">SCREW-CORE COILS</text>
  </svg>;
}
