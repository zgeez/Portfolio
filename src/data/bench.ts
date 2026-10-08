import { projects } from '@/data/projects';
import { site } from '@/data/site';

export const BENCH = { width: 2200, height: 1400, perspective: 2400, rotation: -4, angle: 28 };
export const MOBILE_BENCH = { width: 460, height: 3600 };
export type BenchTarget = 'stm32' | 'board' | 'logic' | 'eeg' | 'waypoint' | 'debug' | 'experience' | 'about' | 'contact' | 'projects' | 'kinetic' | 'camera' | 'iot' | 'charging' | 'iguard';
export type BenchKind = 'scope' | 'board' | 'eeg' | 'waypoint' | 'jtag' | 'laptop' | 'notebook' | 'resume' | 'logic' | 'tray' | 'card' | 'kinetic';
export type BenchObject = {
  id: string;
  target?: BenchTarget;
  label: string;
  subtitle: string;
  type: BenchKind;
  position: { x: number; y: number };
  size: { width: number; height: number };
  focus: { x: number; y: number; scale: number };
  rotation: number;
  layer: 'midground' | 'foreground';
  mobile: { x: number; y: number; width: number; height: number };
};

// Coordinates are in the 2200 × 1400 desk plane. Focus is an absolute point
// in that plane; scale is a multiplier of the fitted overview, not a zoom level.
// Mobile has its own guided composition. The viewing angle stays fixed.
export const benchObjects: BenchObject[] = [
  { id: 'stm32', target: 'stm32', label: 'Oscilloscope', subtitle: 'Two-channel analog capture', type: 'scope', position: { x: 220, y: 140 }, size: { width: 520, height: 295 }, focus: { x: 480, y: 287.5, scale: 2.15 }, rotation: 2, layer: 'midground', mobile: { x: 38, y: 80, width: 360, height: 210 } },
  { id: 'experience', target: 'experience', label: 'Laptop', subtitle: 'Experience / Research', type: 'laptop', position: { x: 1370, y: 85 }, size: { width: 430, height: 350 }, focus: { x: 1585, y: 260, scale: 1.95 }, rotation: -5, layer: 'midground', mobile: { x: 95, y: 1630, width: 310, height: 260 } },
  { id: 'board', target: 'board', label: 'Development board', subtitle: 'Hardware / Timers / DMA', type: 'board', position: { x: 780, y: 540 }, size: { width: 300, height: 200 }, focus: { x: 930, y: 640, scale: 2.4 }, rotation: 10, layer: 'foreground', mobile: { x: 180, y: 395, width: 220, height: 145 } },
  { id: 'eeg', target: 'eeg', label: 'EEG front end', subtitle: 'EEG Acquisition & Neurofeedback', type: 'eeg', position: { x: 260, y: 580 }, size: { width: 350, height: 235 }, focus: { x: 435, y: 697.5, scale: 2.35 }, rotation: -7, layer: 'foreground', mobile: { x: 35, y: 650, width: 315, height: 185 } },
  { id: 'waypoint', target: 'waypoint', label: 'Waypoint compass', subtitle: 'LED Waypoint Compass', type: 'waypoint', position: { x: 1570, y: 580 }, size: { width: 270, height: 270 }, focus: { x: 1705, y: 715, scale: 2.5 }, rotation: 6, layer: 'foreground', mobile: { x: 180, y: 920, width: 215, height: 215 } },
  { id: 'logic', target: 'logic', label: 'Logic analyzer', subtitle: 'Eight channels. One timeline.', type: 'logic', position: { x: 1130, y: 970 }, size: { width: 340, height: 235 }, focus: { x: 1300, y: 1087.5, scale: 2.4 }, rotation: -3, layer: 'midground', mobile: { x: 42, y: 1980, width: 290, height: 200 } },
  { id: 'debug', target: 'debug', label: 'JTAG/SWD Debugger', subtitle: 'Problem → root cause → fix', type: 'jtag', position: { x: 770, y: 960 }, size: { width: 300, height: 190 }, focus: { x: 920, y: 1055, scale: 2.65 }, rotation: 9, layer: 'foreground', mobile: { x: 160, y: 2270, width: 245, height: 155 } },
  { id: 'about', target: 'about', label: 'Notebook', subtitle: 'Education / Skills / Credentials', type: 'notebook', position: { x: 260, y: 1010 }, size: { width: 280, height: 220 }, focus: { x: 400, y: 1120, scale: 2.35 }, rotation: -5, layer: 'foreground', mobile: { x: 30, y: 2520, width: 250, height: 185 } },
  { id: 'resume', label: 'Resume', subtitle: 'Open current resume PDF', type: 'resume', position: { x: 1840, y: 1050 }, size: { width: 230, height: 205 }, focus: { x: 1955, y: 1152.5, scale: 2.4 }, rotation: 7, layer: 'foreground', mobile: { x: 230, y: 2790, width: 190, height: 175 } },
  { id: 'contact', target: 'contact', label: 'Contact', subtitle: 'Let’s talk firmware.', type: 'card', position: { x: 880, y: 190 }, size: { width: 245, height: 145 }, focus: { x: 1002.5, y: 262.5, scale: 2.6 }, rotation: 6, layer: 'foreground', mobile: { x: 50, y: 3050, width: 290, height: 170 } },
  { id: 'projects', target: 'projects', label: 'Parts tray', subtitle: 'All eight projects', type: 'tray', position: { x: 1510, y: 1140 }, size: { width: 260, height: 120 }, focus: { x: 1640, y: 1200, scale: 2.5 }, rotation: 2, layer: 'midground', mobile: { x: 72, y: 3300, width: 330, height: 140 } },
  { id: 'kinetic', target: 'kinetic', label: '7-segment display', subtitle: 'Electromagnetic / Kinetic', type: 'kinetic', position: { x: 1160, y: 570 }, size: { width: 280, height: 245 }, focus: { x: 1300, y: 692.5, scale: 2.5 }, rotation: -4, layer: 'foreground', mobile: { x: 75, y: 1250, width: 280, height: 245 } },
];

const project = (slug: string) => {
  const entry = projects.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Missing bench project: ${slug}`);
  return entry;
};
const stm32 = project('stm32-mixed-signal-instrument');
const eeg = project('eeg-acquisition-neurofeedback-system');
const waypoint = project('led-waypoint-compass');

export type Inspection = { title: string; description?: string; lines?: { label: string; value: string }[]; href?: string; linkLabel?: string; projectSlug?: string; focusObject?: string };
export const inspections: Record<BenchTarget, Inspection> = {
  stm32: { title: 'Oscilloscope · Analog capture', description: 'The STM32 instrument’s two-channel analog path', lines: [{ label: 'Sample rate', value: '1 MS/s · 2 channels' }, { label: 'Inputs', value: 'PC4 / PC5' }], href: `/projects/${stm32.slug}/`, linkLabel: 'Open full project', projectSlug: stm32.slug },
  board: { title: 'STM32F407 · Development board', description: 'The hardware behind the mixed-signal instrument', lines: [{ label: 'Processor', value: 'STM32F407 · ARM Cortex-M4' }, { label: 'Peripherals', value: 'ADC / DAC / DMA / Timers / GPIO' }], href: `/projects/${stm32.slug}/#lens-hardware`, linkLabel: 'Explore the hardware', projectSlug: stm32.slug },
  logic: { title: 'Digital capture', description: 'The STM32 instrument’s logic analyzer', lines: [{ label: 'Channels', value: '8 inputs · PE7–PE14' }, { label: 'Logic capture', value: stm32.metrics![0].value }], href: `/projects/${stm32.slug}/#lens-signals`, linkLabel: 'Open full project', projectSlug: stm32.slug },
  eeg: { title: eeg.shortTitle!, description: 'ADS1299 / ESP32-S3', href: `/projects/${eeg.slug}/`, linkLabel: 'Open full project', projectSlug: eeg.slug },
  waypoint: { title: waypoint.title, description: 'ESP32-S3 / BNO08x / GPS / BLE', href: `/projects/${waypoint.slug}/`, linkLabel: 'Open full project', projectSlug: waypoint.slug },
  debug: { title: 'Debugging stories', description: 'Measured, then explained.', },
  experience: { title: 'Experience / Research', },
  about: { title: 'About / Education', description: site.tagline, },
  contact: { title: 'Let’s talk firmware.', description: site.location, href: `mailto:${site.email}`, linkLabel: 'Send an email' },
  projects: { title: 'Projects on the bench', description: 'Firmware, sensing, instrumentation, and software.', },
  ...Object.fromEntries([
    ['kinetic', 'electromagnetic-kinetic-7-segment-display'], ['camera', 'smart-security-camera-raspberry-pi'],
    ['iot', 'iot-device-automation'], ['charging', 'nyc-dynamic-wireless-charging-roads'], ['iguard', 'iguard-incident-reporting-app'],
  ].map(([target, slug]) => {
    const entry = project(slug);
    return [target, { title: entry.title, href: `/projects/${slug}/`, linkLabel: 'Open full project', projectSlug: slug, focusObject: target === 'kinetic' ? 'kinetic' : 'projects' }];
  })) as Record<'kinetic' | 'camera' | 'iot' | 'charging' | 'iguard', Inspection>,
};

export const projectTargets: Record<string, BenchTarget> = Object.fromEntries(Object.entries(inspections).filter(([target, inspection]) => inspection.projectSlug && target !== 'logic' && target !== 'board').map(([target, inspection]) => [inspection.projectSlug!, target as BenchTarget]));

export function targetFromHash(hash: string): BenchTarget | null {
  const value = hash.replace(/^#/, '');
  const aliases: Record<string, BenchTarget | null> = { systems: null, 'more-systems': 'projects', 'research-experience': 'experience', research: 'experience', skills: 'about' };
  if (Object.prototype.hasOwnProperty.call(aliases, value)) return aliases[value];
  return Object.prototype.hasOwnProperty.call(inspections, value) ? value as BenchTarget : null;
}
