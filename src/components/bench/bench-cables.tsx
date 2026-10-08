import { BENCH, benchObjects } from '@/data/bench';

// Match SVG's default xMidYMid meet and the equipment's CSS rotation.
// Layout changes therefore move the cable endpoint with its physical USB plug.
function benchPort(id: string, x: number, y: number, viewWidth: number, viewHeight: number) {
  const object = benchObjects.find((item) => item.id === id)!;
  const { width, height } = object.size;
  const scale = Math.min(width / viewWidth, height / viewHeight);
  const dx = (x - viewWidth / 2) * scale;
  const dy = (y - viewHeight / 2) * scale;
  const radians = object.rotation * Math.PI / 180;
  return { x: object.position.x + width / 2 + dx * Math.cos(radians) - dy * Math.sin(radians), y: object.position.y + height / 2 + dx * Math.sin(radians) + dy * Math.cos(radians) };
}

export function BenchCables() {
  const debug = benchPort('debug', 20, 67, 330, 220);
  const logic = benchPort('logic', 20, 81, 360, 260);
  const laptop = benchObjects.find((item) => item.id === 'experience')!;
  const port = (fraction: number) => benchPort('experience', 0, laptop.size.height * fraction, laptop.size.width, laptop.size.height);
  const usb1 = port(.76);
  const usb2 = port(.87);
  const paths = [
    `M${debug.x} ${debug.y} C${debug.x - 80} ${debug.y - 5} 705 920 715 855 C715 740 720 650 735 560 C740 495 1045 530 1110 480 C1115 370 ${usb1.x - 75} ${usb1.y + 5} ${usb1.x} ${usb1.y}`,
    `M${logic.x} ${logic.y} C${logic.x - 90} ${logic.y} ${logic.x - 85} 925 1180 910 C1360 885 1530 1040 1500 780 C1490 665 1510 550 1450 535 C1390 550 1290 555 1280 465 C1270 410 ${usb2.x - 70} ${usb2.y} ${usb2.x} ${usb2.y}`,
  ];
  return <svg className="bench-cables" style={{ width: BENCH.width, height: BENCH.height }} viewBox={`0 0 ${BENCH.width} ${BENCH.height}`} fill="none" aria-hidden="true">
    {paths.map((d, index) => <g key={index} data-cable={index === 0 ? 'debug-usb' : 'logic-usb'}><path d={d} stroke="#131a1c" strokeWidth="10" /><path d={d} stroke="#485154" strokeWidth="3" /></g>)}
  </svg>;
}
