import { projects } from '@/data/projects';
import { site } from '@/data/site';

export const BENCH = { width: 2200, height: 1240, perspective: 2400, rotation: -4, angle: 28 };
export const MOBILE_BENCH = { width: 460, height: 3920 };
export type BenchTarget = 'stm32' | 'board' | 'logic' | 'eeg' | 'waypoint' | 'debug' | 'experience' | 'about' | 'contact' | 'projects' | 'kinetic' | 'camera' | 'iot' | 'charging' | 'iguard' | 'badge';
export type BenchKind = 'scope' | 'board' | 'eeg' | 'waypoint' | 'jtag' | 'laptop' | 'notebook' | 'resume' | 'logic' | 'tray' | 'card' | 'kinetic' | 'badge';
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

// Coordinates are in the 2200 × 1240 desk plane. Focus is an absolute point
// in that plane; scale is a multiplier of the fitted overview, not a zoom level.
// Mobile has its own guided composition. The viewing angle stays fixed.
export const benchObjects: BenchObject[] = [
  { id: 'stm32', target: 'stm32', label: 'Oscilloscope', subtitle: 'Two-channel analog capture', type: 'scope', position: { x: 160, y: 100 }, size: { width: 520, height: 295 }, focus: { x: 420, y: 247.5, scale: 2.15 }, rotation: 2, layer: 'midground', mobile: { x: 38, y: 80, width: 360, height: 210 } },
  { id: 'experience', target: 'experience', label: 'Laptop', subtitle: 'Experience / Research', type: 'laptop', position: { x: 1650, y: 50 }, size: { width: 430, height: 350 }, focus: { x: 1865, y: 225, scale: 1.95 }, rotation: -5, layer: 'midground', mobile: { x: 95, y: 1950, width: 310, height: 260 } },
  { id: 'board', target: 'board', label: 'Development board', subtitle: 'Hardware / Timers / DMA', type: 'board', position: { x: 650, y: 550 }, size: { width: 320, height: 213 }, focus: { x: 810, y: 656.5, scale: 2.4 }, rotation: 10, layer: 'foreground', mobile: { x: 180, y: 395, width: 220, height: 145 } },
  { id: 'eeg', target: 'eeg', label: 'EEG front end', subtitle: 'EEG Acquisition & Neurofeedback', type: 'eeg', position: { x: 180, y: 535 }, size: { width: 350, height: 235 }, focus: { x: 355, y: 652.5, scale: 2.35 }, rotation: -7, layer: 'foreground', mobile: { x: 35, y: 650, width: 315, height: 185 } },
  { id: 'waypoint', target: 'waypoint', label: 'Waypoint compass', subtitle: 'LED Waypoint Compass', type: 'waypoint', position: { x: 1500, y: 515 }, size: { width: 270, height: 270 }, focus: { x: 1635, y: 650, scale: 2.5 }, rotation: 6, layer: 'foreground', mobile: { x: 180, y: 920, width: 215, height: 215 } },
  { id: 'logic', target: 'logic', label: 'Logic analyzer', subtitle: 'Eight channels. One timeline.', type: 'logic', position: { x: 1170, y: 130 }, size: { width: 340, height: 235 }, focus: { x: 1340, y: 247.5, scale: 2.4 }, rotation: -3, layer: 'midground', mobile: { x: 42, y: 2300, width: 290, height: 200 } },
  { id: 'debug', target: 'debug', label: 'JTAG/SWD Debugger', subtitle: 'Problem → root cause → fix', type: 'jtag', position: { x: 800, y: 120 }, size: { width: 300, height: 190 }, focus: { x: 950, y: 215, scale: 2.65 }, rotation: 9, layer: 'foreground', mobile: { x: 160, y: 2590, width: 245, height: 155 } },
  { id: 'about', target: 'about', label: 'Notebook', subtitle: 'Education / Skills / Credentials', type: 'notebook', position: { x: 220, y: 900 }, size: { width: 280, height: 220 }, focus: { x: 360, y: 1010, scale: 2.35 }, rotation: -5, layer: 'foreground', mobile: { x: 30, y: 2840, width: 250, height: 185 } },
  { id: 'resume', label: 'Resume', subtitle: 'Open current resume PDF', type: 'resume', position: { x: 1800, y: 900 }, size: { width: 230, height: 205 }, focus: { x: 1915, y: 1002.5, scale: 2.4 }, rotation: 7, layer: 'foreground', mobile: { x: 230, y: 3110, width: 190, height: 175 } },
  { id: 'contact', target: 'contact', label: 'Contact', subtitle: 'Let’s talk firmware.', type: 'card', position: { x: 800, y: 950 }, size: { width: 280, height: 166 }, focus: { x: 940, y: 1033, scale: 2.6 }, rotation: 6, layer: 'foreground', mobile: { x: 50, y: 3650, width: 290, height: 170 } },
  { id: 'projects', target: 'projects', label: 'Parts tray', subtitle: 'All nine projects', type: 'tray', position: { x: 1320, y: 960 }, size: { width: 300, height: 138 }, focus: { x: 1470, y: 1029, scale: 2.5 }, rotation: 2, layer: 'midground', mobile: { x: 72, y: 3370, width: 330, height: 140 } },
  { id: 'kinetic', target: 'kinetic', label: '7-segment display', subtitle: 'Electromagnetic / Kinetic', type: 'kinetic', position: { x: 1830, y: 540 }, size: { width: 270, height: 236 }, focus: { x: 1965, y: 658, scale: 2.5 }, rotation: -4, layer: 'foreground', mobile: { x: 75, y: 1590, width: 280, height: 245 } },
  { id: 'badge', target: 'badge', label: 'Pixel Badge', subtitle: '32 × 32 / BLE + NFC', type: 'badge', position: { x: 1075, y: 550 }, size: { width: 320, height: 204 }, focus: { x: 1235, y: 652, scale: 2.8 }, rotation: -6, layer: 'foreground', mobile: { x: 75, y: 1250, width: 300, height: 191 } },
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
  badge: { title: 'Pixel Badge', description: 'nRF52840 / 32 × 32 / BLE + NFC', href: '/projects/smart-led-badge/', linkLabel: 'Open full project', projectSlug: 'smart-led-badge' },
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
