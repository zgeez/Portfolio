// Offset each conductor perpendicular to the ribbon's curve, so the band
// retains its width through bends rather than collapsing at vertical tangents.
function ribbonConductor(offset: number) {
  const segments = [
    [[199,70],[261,70],[283,105],[265,139]],
    [[265,139],[250,167],[268,178],[287,178]],
  ];
  return segments.flatMap(([a,b,c,d], segment) => Array.from({ length: 33 }, (_, index) => {
    const t=index/32, u=1-t;
    const x=u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0];
    const y=u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1];
    const dx=3*u*u*(b[0]-a[0])+6*u*t*(c[0]-b[0])+3*t*t*(d[0]-c[0]);
    const dy=3*u*u*(b[1]-a[1])+6*u*t*(c[1]-b[1])+3*t*t*(d[1]-c[1]);
    const length=Math.hypot(dx,dy);
    return `${segment === 0 && index === 0 ? 'M' : 'L'}${(x-dy/length*offset).toFixed(2)} ${(y+dx/length*offset).toFixed(2)}`;
  })).join(' ');
}

export function JtagDebugger() {
  const ribbon = 'M199 70 C261 70 283 105 265 139 C250 167 268 178 287 178';
  return <svg viewBox="0 0 330 220" className="bench-svg" data-device="jtag-probe">
    {/* One flat ribbon and a keyed, double-row connector distinguish this pod. */}
    <path d={ribbon} fill="none" stroke="#30393b" strokeWidth="35" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={ribbonConductor(-14 + i * 3.5)} fill="none" stroke={i === 0 ? '#c18375' : '#a5aaa0'} strokeWidth="2.3" />)}
    <rect x="282" y="158" width="40" height="41" rx="2" fill="#1d272a" stroke="#738180" strokeWidth="2" />
    <path d="M282 172 h-4 v12 h4" fill="#1d272a" stroke="#738180" />
    <rect x="289" y="163" width="26" height="31" fill="#10191c" stroke="#39494b" />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={293 + (i % 2) * 12} y={167 + Math.floor(i / 2) * 5} width="4" height="3" fill="#c9b68a" />)}
    <rect x="20" y="59" width="26" height="17" rx="2" fill="#b9c4c6" stroke="#73858a" /><rect x="22" y="63" width="8" height="9" fill="#34464d" />
    <path d="M42 27 H176 L193 45 V113 L177 130 H43 L32 117 V43z" fill="#151f27" />
    <path d="M42 19 H176 L193 37 V105 L177 122 H43 L32 109 V35z" fill="#354b5a" stroke="#71858d" strokeWidth="2" />
    <rect x="46" y="32" width="133" height="76" rx="3" fill="#2b3e4c" stroke="#4a6372" />
    {[[42,30],[177,38],[42,110],[177,109]].map(([x,y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="2.3" fill="#1c313c" /><path d={`M${x-1} ${y} h2`} stroke="#7f999d" /></g>)}
    <circle cx="164" cy="44" r="3" fill="#8bc4a3" />
    <text x="62" y="59" fill="#d3dfdf" fontSize="14" fontWeight="600" letterSpacing="1">JTAG / SWD</text>
    <text x="63" y="78" fill="#a4b7ba" fontSize="8" letterSpacing="1.5">DEBUG PROBE</text>
    {Array.from({length: 5}, (_, i) => <path key={i} d={`M${62+i*10} 92 v8`} stroke="#192f3b" strokeWidth="3" />)}
    <rect x="184" y="53" width="17" height="35" rx="2" fill="#172126" stroke="#5e7076" />
    <path d="M38 109 H179" stroke="#1b2a35" strokeWidth="2" />
  </svg>;
}

export function LogicAnalyzer() {
  const colors = ['#c7af78', '#ba8c80', '#8bb5b2', '#a1b47f', '#a2bdce', '#c8ab88', '#ae9dbe', '#c4cabc'];
  return <svg viewBox="0 0 360 260" className="bench-svg" data-device="logic-analyzer">
    {/* A low-profile USB box with separate channel leads and grabber tips. */}
    {colors.map((color, i) => {
      const x = 71 + i * 16;
      const endX = 53 + i * 39;
      const endY = 216 + (i % 3) * 10;
      return <g key={color} data-channel={i}>
        <path d={`M${x} 145 C${x} 174 ${endX} 161 ${endX} ${endY}`} fill="none" stroke="#141a1d" strokeWidth="6" />
        <path d={`M${x} 145 C${x} 174 ${endX} 161 ${endX} ${endY}`} fill="none" stroke={color} strokeWidth="3" />
        <rect x={endX - 6} y={endY - 5} width="12" height="5" rx="2" fill={color} />
        <rect x={endX - 5} y={endY - 2} width="10" height="18" rx="3" fill="#242c2f" stroke={color} strokeWidth="1" />
        <path d={`M${endX} ${endY + 16} v5 q0 3 -4 1`} fill="none" stroke="#c6d0c3" strokeWidth="2" />
      </g>;
    })}
    <rect x="20" y="73" width="23" height="16" rx="2" fill="#b8c2c1" stroke="#758787" /><path d="M23 76 h9 v10 h-9" fill="#38494b" />
    <rect x="37" y="28" width="188" height="119" rx="12" fill="#101719" />
    <rect x="37" y="20" width="188" height="119" rx="12" fill="#323b3e" stroke="#697577" strokeWidth="2" />
    <rect x="45" y="28" width="172" height="103" rx="9" fill="#283033" stroke="#3e494d" />
    <circle cx="203" cy="43" r="3" fill="#a4c8b3" />
    <text x="64" y="64" fill="#d3dedb" fontSize="17" fontWeight="500" letterSpacing="3">LOGIC</text>
    <text x="66" y="86" fill="#a3b4b1" fontSize="8" letterSpacing="1.5">DIGITAL CAPTURE</text>
    <path d="M67 102 h16 v-9 h18 v9 h20 v-9 h22 v9 h36" fill="none" stroke="#819f97" strokeWidth="2" />
    <rect x="60" y="120" width="137" height="25" rx="2" fill="#141d20" stroke="#535f5c" />
    {Array.from({ length: 8 }, (_, i) => <g key={i}><rect x={68 + i * 16} y="136" width="6" height="9" fill="#b5ac8a" /><text x={71 + i * 16} y="131" textAnchor="middle" fill="#9faeaa" fontSize="6">{i}</text></g>)}
  </svg>;
}
