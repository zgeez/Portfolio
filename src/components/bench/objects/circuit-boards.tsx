function Header({ x, y, count, vertical = false }: { x: number; y: number; count: number; vertical?: boolean }) {
  return <g transform={`translate(${x} ${y})${vertical ? ' rotate(90)' : ''}`}>
    <rect width={count * 10 + 4} height="19" rx="1" fill="#171d1d" stroke="#5c6861" />
    {Array.from({ length: count }, (_, i) => <g key={i} fill="#b8b190"><rect x={6 + i * 10} y="4" width="3" height="3" /><rect x={6 + i * 10} y="12" width="3" height="3" /></g>)}
  </g>;
}

function Processor({ x, y, size, label }: { x: number; y: number; size: number; label: string }) {
  return <g transform={`translate(${x} ${y})`}>
    <g stroke="#b2b6ab" strokeWidth="2">{Array.from({ length: 12 }, (_, i) => {
      const p = 4 + i * (size - 8) / 11;
      return <path key={i} d={`M${p} -6 V0 M${p} ${size} v6 M-6 ${p} H0 M${size} ${p} h6`} />;
    })}</g>
    <rect width={size} height={size} rx="2" fill="#202725" stroke="#0f1715" strokeWidth="2" />
    <circle cx="7" cy="7" r="2" fill="#69776c" />
    <text x={size / 2} y={size / 2 + 3} textAnchor="middle" fill="#aeb9ae" fontSize="8">{label}</text>
  </g>;
}

export function Stm32Board() {
  return <svg viewBox="0 0 310 210" className="bench-svg" data-device="stm32-discovery">
    <rect x="6" y="17" width="297" height="185" rx="3" fill="#133948" />
    <rect x="6" y="9" width="297" height="185" rx="3" fill="#24586a" stroke="#709899" strokeWidth="2" />
    <path d="M10 13 H299 M10 13 V190" fill="none" stroke="#88aaa1" opacity=".5" />
    <g fill="none" stroke="#6a9590" strokeWidth="1" opacity=".55">
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${110 + i * 5} 75 V${44 + i * 2} H${62 + i * 9} V31 M${110 + i * 5} 126 V${147 + i} H${66 + i * 12} V178`} />)}
      <path d="M80 100 H39 V61 H70 M180 90 H245 V58 M178 107 H266 V148" />
    </g>
    <Header x={44} y={17} count={22} /><Header x={44} y={166} count={22} />
    <Processor x={102} y={73} size={59} label="STM32F407" />
    <Processor x={214} y={67} size={32} label="ST" />
    <rect x="26" y="63" width="33" height="32" rx="2" fill="#bcc4c2" stroke="#737e7c" />
    <rect x="27" y="70" width="23" height="18" fill="#303c3d" />
    <path d="M31 73 h15 M31 85 h15" stroke="#c2b690" strokeWidth="2" />
    <rect x="272" y="68" width="31" height="29" rx="2" fill="#b6bfbe" /><rect x="283" y="73" width="18" height="18" fill="#334345" />
    <rect x="66" y="67" width="16" height="30" rx="2" fill="#bdc8c3" stroke="#829b95" />
    <circle cx="53" cy="133" r="12" fill="#151e24" stroke="#738e8e" strokeWidth="2" />
    <circle cx="187" cy="126" r="9" fill="#467f92" stroke="#15262b" strokeWidth="3" />
    <circle cx="245" cy="126" r="8" fill="#222a2b" stroke="#829491" strokeWidth="2" />
    {['#bfa054', '#79a488', '#ac6863', '#6999a9'].map((color, i) => <rect key={color} x={181 + (i % 2) * 14} y={69 + Math.floor(i / 2) * 17} width="7" height="8" rx="1" fill={color} />)}
    <g fill="#a2bba9">{Array.from({ length: 10 }, (_, i) => <rect key={i} x={75 + (i % 5) * 24} y={137 + Math.floor(i / 5) * 10} width="9" height="4" />)}</g>
    <text x="208" y="152" fill="#c3d4ca" fontSize="8" letterSpacing="1">DISCOVERY</text>
    <text x="70" y="55" fill="#adc6ba" fontSize="6">STM32F4</text>
    <text x="46" y="155" fill="#c7d9c5" fontSize="5">RESET</text><text x="175" y="143" fill="#c7d9c5" fontSize="5">USER</text>
    {[40,85,175,258].map(x => <g key={x}><rect x={x} y="107" width="7" height="3" fill="#b7c4b3" /><rect x={x+1} y="107" width="5" height="3" fill="#34483d" /></g>)}
    {[18, 291].flatMap((x) => [21, 182].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#152c35" stroke="#b3b392" />))}
  </svg>;
}

// Form and component placement follow the existing ADS1299/MMB0 photos.
export function EegRig() {
  return <svg viewBox="0 0 400 260" className="bench-svg" data-device="ads1299-stack">
    <rect x="34" y="41" width="348" height="208" rx="2" fill="#23483d" stroke="#658478" strokeWidth="2" />
    {[[44,53],[368,53],[44,235],[368,235]].map(([x,y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="6" fill="#8c9681" stroke="#c6c0a4" /><circle cx={x} cy={y} r="2" fill="#3b4d3f" /></g>)}
    <Header x={53} y={220} count={28} /><Processor x={244} y={105} size={59} label="MMB0" />
    <rect x="346" y="127" width="46" height="40" rx="2" fill="#b8c3bf" stroke="#647c71" /><rect x="370" y="132" width="25" height="28" fill="#43524f" />
    <rect x="349" y="188" width="43" height="23" rx="8" fill="#182821" /><circle cx="390" cy="199" r="8" fill="#070d0b" stroke="#7a8674" />
    <rect x="8" y="16" width="311" height="218" rx="3" fill="#1a382f" />
    <rect x="8" y="7" width="311" height="218" rx="3" fill="#386c55" stroke="#82a083" strokeWidth="2" />
    <path d="M12 11 H315 M12 11 V221" fill="none" stroke="#afbc90" opacity=".5" />
    <g fill="none" stroke="#9cad72" strokeWidth="1.2" opacity=".6">
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${111 + i * 20} 36 V${60 + i * 4} H${128 + i * 5} V96 M${130 + i * 5} 151 V${174 + i * 2} H${85 + i * 15} V204`} />)}
      <path d="M39 44 V91 H83 V180 M207 114 H270 V195" />
    </g>
    <Header x={98} y={18} count={20} /><Header x={85} y={195} count={19} />
    <Processor x={126} y={92} size={58} label="ADS1299" />
    {Array.from({ length: 8 }, (_, i) => <g key={i}><rect x={104 + i * 24} y="51" width="9" height="7" fill="#b2c0a3" /><rect x={105 + i * 24} y="66" width="7" height="10" fill="#1d362b" /><text x={108 + i * 24} y="87" textAnchor="middle" fill="#bdc9a6" fontSize="6">{i + 1}</text></g>)}
    <circle cx="39" cy="42" r="18" fill="#aaa583" stroke="#d2c28d" strokeWidth="3" /><circle cx="39" cy="42" r="6" fill="#243e31" />
    <rect x="34" y="119" width="29" height="37" rx="2" fill="#b6c0a9" stroke="#7b9981" />
    {[[81, 102], [221, 132], [222, 175], [69, 180]].map(([x, y]) => <g key={`${x}-${y}`}><rect x={x} y={y} width="18" height="17" fill="#192f25" /><circle cx={x + 24} cy={y + 7} r="5" fill="#a26b66" stroke="#bcaaa0" /></g>)}
    <g fill="#adbc9f">{Array.from({ length: 16 }, (_, i) => <rect key={i} x={82 + (i % 8) * 25} y={156 + Math.floor(i / 8) * 11} width="9" height="4" />)}</g>
    <text x="23" y="88" fill="#c5d4b5" fontSize="8">ADS1299EEG-FE</text>
    <text x="236" y="114" fill="#bfd0ad" fontSize="7">SPI</text>
    {[20, 307].flatMap((x) => [19, 213].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#213f2e" stroke="#afaa7f" />))}
  </svg>;
}
