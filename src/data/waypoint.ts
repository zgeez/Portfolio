// Verified facts for the LED Waypoint Compass. Source: the project write-up.

import type { ProbeDiagramData } from '@/components/portfolio/abstraction/probe-diagram';
import type { ProjectLayer } from '@/components/projects/types';

export const waypointHeroMetrics = [
  { value: '<2°', label: 'reported heading deviation', detail: 'BNO08x · project write-up' },
  { value: '22.5°', label: 'per pixel', detail: '16-pixel ring' },
  { value: '1 Hz', label: 'BLE telemetry', detail: 'GPS, nav & bearing' },
  { value: '2 m', label: 'arrival radius', detail: 'great-circle distance' },
];

export const waypointLayers: ProjectLayer[] = [
  { id: 'product', label: 'Product', caption: 'A compass that points instead of mapping' },
  { id: 'system', label: 'System', caption: 'Sensors, MCU, ring and phone' },
  { id: 'firmware', label: 'Firmware', caption: 'A ring that never shows a direction it cannot justify' },
  { id: 'navigation', label: 'Sensor / nav', caption: 'From quaternion to pixel' },
  { id: 'protocol', label: 'Protocol', caption: 'BLE commands, telemetry and testing' },
];

/** NeoPixel colours from the firmware, brightened for screen. */
export const LED = {
  forward: '#ff3b30',
  target: '#00e5ff',
  warn: '#ff1744',
  trail: '#2962ff',
  idle: '#4dd0e1',
  arrived: '#00e676',
  amber: '#ffc400',
  amberDim: '#8d6e00',
} as const;

export type RingState = {
  id: string;
  name: string;
  trigger: string;
  pixels: (string | null)[];
  pulse?: boolean;
};

const fill = (c: string | null) => Array<string | null>(16).fill(c);

/** Forward pixel at 0, target at `target`, trail pixels either side of the target. */
export const pointer = (target: number, targetColor: string = LED.target) => {
  const p = fill(null);
  p[(target + 1) % 16] = LED.trail;
  p[(target + 15) % 16] = LED.trail;
  p[target] = targetColor;
  p[0] = LED.forward;
  return p;
};

/** Render priority: no destination, no fix, arrived, no heading, then the live pointer. */
export const ringStates: RingState[] = [
  { id: 'idle', name: 'Idle', trigger: 'No destination stored', pixels: fill(LED.idle), pulse: true },
  { id: 'nofix', name: 'No GPS fix', trigger: 'All pixels blink red', pixels: fill(LED.forward), pulse: true },
  { id: 'arrived', name: 'Arrived', trigger: 'Within 2 m of the destination', pixels: fill(LED.arrived) },
  {
    id: 'heading',
    name: 'Need heading',
    trigger: 'Fix, but no IMU heading or course yet',
    pixels: Array.from({ length: 16 }, (_, i) => (i % 2 === 0 ? LED.amber : LED.amberDim)),
  },
  { id: 'nav', name: 'Navigating', trigger: 'Cyan target, blue trail, red forward', pixels: pointer(3) },
  { id: 'lowacc', name: 'Low accuracy', trigger: 'HDOP > 6, < 4 sats, stale fix or IMU', pixels: pointer(11, LED.warn) },
];

export const waypointSystemDiagram: ProbeDiagramData = {
  viewBox: '0 0 640 300',
  title: 'LED Waypoint Compass system architecture',
  nodes: [
    {
      id: 'gps',
      label: 'GT-U7 GPS',
      sub: 'UART · 9600 NMEA',
      x: 20, y: 40, w: 160, h: 56,
      probe: {
        title: 'GPS',
        items: [
          'NMEA over UART at 9600 baud, parsed with TinyGPS++',
          'Fix flagged poor when HDOP > 6, fewer than 4 satellites, or older than 2 s',
          'Course-over-ground is the heading fallback once moving',
        ],
      },
    },
    {
      id: 'imu',
      label: 'BNO08x IMU',
      sub: 'I²C · 400 kHz',
      x: 20, y: 200, w: 160, h: 56,
      probe: {
        title: 'IMU',
        items: [
          'AR/VR-stabilized rotation vector: a quaternion with an accuracy estimate',
          'Heading flagged when its accuracy estimate exceeds 0.35 rad (~20°)',
          'Probes 0x4B then 0x4A; reinitializes after 1.5 s of stalled heading',
        ],
      },
    },
    {
      id: 'mcu',
      label: 'XIAO ESP32-S3',
      sub: 'fusion · nav · ring state',
      x: 240, y: 112, w: 170, h: 70,
      variant: 'core',
      probe: {
        title: 'Seeed XIAO ESP32-S3',
        items: [
          'Non-blocking main loop polls GPS, IMU and BLE',
          'Quaternion → compass heading; distance, bearing and ring state',
          'Telemetry published once a second',
          'NVS: destination and IMU mounting offset survive reboots',
        ],
      },
    },
    {
      id: 'ring',
      label: 'NeoPixel ring',
      sub: '16 px · 22.5° each',
      x: 470, y: 40, w: 150, h: 56,
      probe: {
        title: 'LED ring',
        items: [
          'Red pixel: the way the device faces. Cyan pixel: the way to go',
          'Brightness 4–255, set over BLE',
          'Strict render priority, so it never shows an unjustified direction',
        ],
      },
    },
    {
      id: 'app',
      label: 'Flutter app',
      sub: 'BLE · Nordic UART',
      x: 470, y: 200, w: 150, h: 56,
      variant: 'link',
      probe: {
        title: 'Companion app',
        items: [
          'Scans for NUS, negotiates a larger MTU, subscribes to telemetry',
          'Destinations picked on a map and sent with one tap',
          'A ring mirror re-implements the firmware’s rendering rules',
          'Only needed to set a destination; the device navigates on its own',
        ],
      },
    },
  ],
  edges: [
    { id: 'gps-mcu', from: 'gps', to: 'mcu', d: 'M180 68 H210 V134 H240', flow: true },
    { id: 'imu-mcu', from: 'imu', to: 'mcu', d: 'M180 228 H210 V160 H240', flow: true },
    { id: 'mcu-ring', from: 'mcu', to: 'ring', d: 'M410 134 H440 V68 H470', flow: true },
    { id: 'mcu-app', from: 'mcu', to: 'app', d: 'M410 160 H440 V228 H470', label: 'BLE', lx: 452, ly: 200, flow: true },
  ],
};

export const waypointCommands = [
  ['SET <lat> <lon>', 'Store a destination; rejects out-of-range coordinates', 'OK SET lat=… lon=…'],
  ['GET', 'Report the stored destination', 'STORED … / NO_STORED_DEST'],
  ['CLR', 'Clear the destination', 'OK CLEARED'],
  ['BRIGHT <n>', 'Ring brightness, clamped to 4–255', 'LED_BRIGHT n'],
  ['ALIGN AUTO | RESET | ? | <deg>', 'Zero, restore, query or set the IMU mounting offset', 'IMU_ALIGN offset=…'],
] as const;

export const waypointTelemetry = `GPS_STATUS seq=41 fix=1 lat=40.620667 lat_valid=1 lon=-74.030255 lon_valid=1 hdop=1.1 hdop_valid=1 sats=8 sats_valid=1 age_ms=99 …
BEARING 214.9 SW dist_m=12 cog=? head=213.8 hdop=1.1 sats=8 age_ms=99 lat=40.620667 lon=-74.030255
NAV_STATUS seq=41 state=ACTIVE reason=NAVIGATING dest=1 fix=1 warn=0 at_dest=0 bearing_deg=214.9 distance_m=12.3 …`;

export const waypointTestEnvs = [
  ['fake_gps', 'A synthetic fix orbiting a 15 m circle once every two minutes, with consistent course and speed. Exercises bearing, ring rendering and BLE telemetry at a desk.'],
  ['gps_test', 'GPS wiring, baud rate and NMEA flow; flags a silent UART within a second.'],
  ['bno08x_test', 'I²C bus scan and raw BNO08x reports, independent of the navigation stack.'],
] as const;
