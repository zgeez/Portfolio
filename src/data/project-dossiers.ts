import type { Project, ProjectMetric } from './projects';
import { stm32HeroMetrics, stm32Layers } from './stm32-msi';
import { eegHeroMetrics, eegLayers } from './eeg';
import { waypointHeroMetrics, waypointLayers } from './waypoint';
import type { ProjectChapter, ProjectLayer } from '@/components/projects/types';

export const kineticLayers: ProjectLayer[] = [
  { id: 'product', label: 'Overview', caption: 'A digit that moves instead of glowing' },
  { id: 'mechanics', label: 'Mechanics', caption: 'Rails, magnets and a screw for a core' },
  { id: 'electronics', label: 'Electronics', caption: 'Coils and H-bridges' },
  { id: 'firmware', label: 'Firmware', caption: 'Pulse only what changes' },
  { id: 'energy', label: 'Energy', caption: 'Where the 100× comes from' },
];

export type ProjectArtifact = 'board' | 'eeg' | 'waypoint' | 'kinetic' | 'camera' | 'iot' | 'study' | 'app' | 'badge';
type Metric = ProjectMetric & { detail?: string };
type Presentation = { title: string[]; artifact: ProjectArtifact; device: string; chapters: ProjectChapter[]; metrics?: readonly Metric[] };
const chapters = (items: [string, string][]): ProjectChapter[] => items.map(([id, label]) => ({ id, label }));
const layers = (items: ProjectLayer[]): ProjectChapter[] => items.map(({ id, label }) => ({ id: `lens-${id}`, label: id === 'product' ? 'Overview' : label }));

// Presentation only. Results are retained from the existing technical documents.
export const projectPresentations: Record<string, Presentation> = {
  'smart-led-badge': {
    title: ['Pixel', 'Badge'], artifact: 'badge', device: 'nRF52840 / 32 × 32 / BLE + NFC',
    chapters: chapters([['overview', 'Overview'], ['architecture', 'Architecture'], ['hardware', 'Hardware'], ['firmware', 'Firmware'], ['app', 'Companion app'], ['mechanics', 'Mechanical design'], ['debugging', 'Debugging'], ['validation', 'Validation'], ['reflection', 'Reflection']]),
  },
  'stm32-mixed-signal-instrument': {
    title: ['STM32', 'Mixed-Signal Instrument'], artifact: 'board', device: 'STM32F407 / DISCOVERY', metrics: stm32HeroMetrics,
    chapters: [...chapters([['overview', 'Overview']]), ...layers(stm32Layers).map(chapter => chapter.id === 'lens-product' ? { ...chapter, label: 'Instrument' } : chapter), ...chapters([['measurements', 'Measurements'], ['validation', 'Validation'], ['limitations', 'Limitations'], ['source', 'Source']])],
  },
  'eeg-acquisition-neurofeedback-system': {
    title: ['EEG Acquisition', '& Neurofeedback'], artifact: 'eeg', device: 'ADS1299 / ESP32-S3', metrics: eegHeroMetrics,
    chapters: [...layers(eegLayers), ...chapters([['debugging', 'Debugging'], ['scope', 'Privacy & scope'], ['next', 'Limitations'], ['source', 'Project site']])],
  },
  'led-waypoint-compass': {
    title: ['LED Waypoint', 'Compass'], artifact: 'waypoint', device: '16 PIXELS / BLE', metrics: waypointHeroMetrics,
    chapters: [...layers(waypointLayers), ...chapters([['debugging', 'Debugging'], ['built-with', 'Built with']])],
  },
  'electromagnetic-kinetic-7-segment-display': {
    title: ['Kinetic', '7-Segment Display'], artifact: 'kinetic', device: 'MAGNETIC SEGMENTS / PULSE TO CHANGE',
    metrics: [
      { value: '~12.5 mW', label: 'estimated average power', detail: '8 pulses/min · at 5 V' },
      { value: '100×', label: 'LED / kinetic power ratio', detail: '≈250 mA / ~1.25 W LED baseline' },
      { value: '25 ms', label: 'actuation pulse', detail: 'zero hold current' },
      { value: '400', label: 'turns per coil', detail: 'M3 screw core' },
    ],
    chapters: [...layers(kineticLayers), ...chapters([['reflection', 'Reflection'], ['built-with', 'Built with']])],
  },
  'smart-security-camera-raspberry-pi': {
    title: ['Smart', 'Security Camera'], artifact: 'camera', device: 'RASPBERRY PI 5 / PIR / CAMERA',
    metrics: [
      { value: '3 → 30', label: 'FPS on CPU', detail: 'after optimization' },
      { value: '33 ms', label: 'inference time', detail: 'from 330 ms · INT8' },
      { value: '−70%', label: 'idle CPU', detail: 'PIR motion gating' },
      { value: '95%', label: 'person-detection accuracy', detail: 'after INT8' },
    ],
    chapters: chapters([['overview', 'Overview'], ['architecture', 'Architecture'], ['implementation', 'Implementation'], ['optimizations', 'Optimizations'], ['dashboard', 'Dashboard'], ['results', 'Results & next']]),
  },
  'iot-device-automation': {
    title: ['IoT Device', 'Automation'], artifact: 'iot', device: 'ESP32 / MODULAR NODE / MQTT',
    metrics: [
      { value: '<200 ms', label: 'command round trip', detail: 'reserved MQTT topics' },
      { value: '×3', label: 'battery life vs. baseline', detail: 'multi-mode deep sleep' },
      { value: '~80 ms', label: 'faster reconnect', detail: 'MQTT session in RTC memory' },
    ],
    chapters: chapters([['overview', 'Overview'], ['architecture', 'Architecture'], ['firmware', 'Firmware & power'], ['app', 'Mobile app'], ['debugging', 'Challenges'], ['stack', 'Stack & next']]),
  },
  'nyc-dynamic-wireless-charging-roads': {
    title: ['Wireless Charging', 'Roads Simulation'], artifact: 'study', device: 'SUMO / MATLAB / PYTHON',
    metrics: [
      { value: '< 3 mi', label: 'of lane offsets an EV’s daily energy', detail: 'simulated, 42nd St' },
      { value: '9–28%', label: 'SOC gain per trip', detail: 'WPT-4, 22 kW' },
      { value: '≈35%', label: 'lower CapEx per lane-mile', detail: 'WPT-4 vs dual-pad WPT-3' },
      { value: '±5%', label: 'pickup vs. published field data' },
    ],
    chapters: chapters([['problem', 'Problem'], ['method', 'Method'], ['results', 'Results'], ['validation', 'Validation'], ['impact', 'Impact & next']]),
  },
  'iguard-incident-reporting-app': {
    title: ['iGuard', 'Community Incident Reporting'], artifact: 'app', device: 'FLUTTER / FIREBASE / GEO-FENCED ALERTS',
    chapters: chapters([['overview', 'Overview'], ['features', 'Features'], ['architecture', 'Architecture'], ['screens', 'Screens'], ['challenges', 'Challenges']]),
  },
};

export function projectPresentation(project: Project): Presentation & { metrics: readonly Metric[] } {
  const presentation = projectPresentations[project.slug];
  if (!presentation) throw new Error(`Missing dossier presentation: ${project.slug}`);
  return { ...presentation, metrics: presentation.metrics ?? project.metrics ?? [] };
}
