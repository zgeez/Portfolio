import type { CSSProperties, ReactNode } from 'react';
import { BENCH, MOBILE_BENCH, type BenchObject } from '@/data/bench';

export type Camera = { x: number; y: number; scale: number };
export type ViewSize = { width: number; height: number };

// Matches perspective() rotateX() rotateZ() on the desk, around its center.
export function projectPoint(x: number, y: number, angle: number) {
  const a = angle * Math.PI / 180;
  const r = BENCH.rotation * Math.PI / 180;
  const dx = x - BENCH.width / 2;
  const dy = y - BENCH.height / 2;
  const rx = dx * Math.cos(r) - dy * Math.sin(r);
  const ry = dx * Math.sin(r) + dy * Math.cos(r);
  const perspective = 1 - ry * Math.sin(a) / BENCH.perspective;
  return { x: BENCH.width / 2 + rx / perspective, y: BENCH.height / 2 + ry * Math.cos(a) / perspective };
}

export function cameraFor(size: ViewSize, angle: number, object?: BenchObject): Camera {
  const corners = [[0, 0], [BENCH.width, 0], [0, BENCH.height], [BENCH.width, BENCH.height]].map(([x, y]) => projectPoint(x, y, angle));
  const left = Math.min(...corners.map((point) => point.x));
  const right = Math.max(...corners.map((point) => point.x));
  const top = Math.min(...corners.map((point) => point.y));
  const bottom = Math.max(...corners.map((point) => point.y));
  const overview = Math.max(0.1, Math.min((size.width - 80) / (right - left), (size.height - 190) / (bottom - top)));
  if (!object) return { x: size.width / 2 - (left + right) / 2 * overview, y: (size.height + 10) / 2 - (top + bottom) / 2 * overview, scale: overview };
  const point = projectPoint(object.focus.x, object.focus.y, angle);
  const sidePanel = size.width >= 1000 || (size.width >= 768 && size.height <= 540);
  const panelWidth = size.width >= 1000 ? 440 : Math.min(400, size.width * 0.48);
  const spaceWidth = sidePanel ? size.width - panelWidth - 70 : size.width - 80;
  const spaceHeight = sidePanel ? size.height - 220 : size.height * 0.42;
  const scale = Math.min(overview * object.focus.scale, spaceWidth / (object.size.width * 1.3), spaceHeight / (object.size.height * 1.3));
  return { x: (sidePanel ? spaceWidth / 2 : size.width / 2) - point.x * scale, y: (sidePanel ? size.height * 0.5 : size.height * 0.29) - point.y * scale, scale };
}

export function BenchCamera({ camera, angle, mobile, size, children }: { camera: Camera; angle: number; mobile: boolean; size: ViewSize; children: ReactNode }) {
  const mobileScale = size.width / MOBILE_BENCH.width;
  const cameraStyle: CSSProperties = mobile
    ? { transform: `scale(${mobileScale})`, height: MOBILE_BENCH.height, width: MOBILE_BENCH.width }
    : { transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`, width: BENCH.width, height: BENCH.height };
  return (
    <div className="bench-scroll-space" style={mobile ? { height: MOBILE_BENCH.height * mobileScale } : undefined}>
      <div className="bench-camera" style={cameraStyle}>
        <div className="bench-plane" style={{ '--bench-angle': `${angle}deg`, width: mobile ? MOBILE_BENCH.width : BENCH.width, height: mobile ? MOBILE_BENCH.height : BENCH.height } as CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}
