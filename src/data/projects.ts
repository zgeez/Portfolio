// Project registry shared by the homepage and /projects/[slug].
// Values are factual and come from each project's write-up (and the resume where
// the write-up is silent). Do not add metrics here that the source does not state.

import { asset } from '@/data/site';
import { stm32Links, stm32Metrics } from '@/data/stm32-msi';

export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  shortTitle?: string;
  /** One-sentence system purpose, used on the project page and for SEO. */
  summary: string;
  /** Why it is technically interesting, in one line, for cards. */
  hook: string;
  image: string;
  imageAlt: string;
  imageHint: string;
  /** Lightweight card thumbnail (generated from `image`). */
  thumb: string;
  category: 'firmware' | 'research' | 'embedded-linux' | 'iot' | 'software';
  featured: boolean;
  order: number;
  role?: string;
  technologies: string[];
  metrics?: ProjectMetric[];
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: 'stm32-mixed-signal-instrument',
    title: 'STM32 Mixed-Signal Instrument',
    shortTitle: 'Mixed-Signal Instrument',
    summary:
      'A USB bench instrument built on an STM32F407 Discovery board that generates, captures, and correlates analog and digital signals from one device.',
    hook: 'AWG, oscilloscope and logic analyzer in one STM32, with analog and digital capture released by chained hardware timers onto a single timeline.',
    image: asset('assets/stm32-msi/mixed_capture.png'),
    imageAlt:
      'Mixed capture view: a sine on analog channel CH1 above eight logic traces D0 to D7, plotted against time from trigger',
    imageHint: 'mixed-signal capture with analog and logic traces on one timeline',
    thumb: asset('assets/thumbs/stm32-mixed-signal-instrument.webp'),
    category: 'firmware',
    featured: true,
    order: 1,
    role: 'Personal project · firmware, host application, protocol and validation',
    technologies: ['STM32F407', 'C', 'FreeRTOS', 'DMA', 'USB CDC', 'Python', 'PySide6'],
    metrics: [stm32Metrics.logicRate, stm32Metrics.latency, stm32Metrics.skew],
    links: [
      { label: 'Source', href: stm32Links.repo },
      { label: 'Releases', href: stm32Links.releases },
    ],
  },
  {
    slug: 'eeg-acquisition-neurofeedback-system',
    title: 'EEG Acquisition & Neurofeedback System',
    shortTitle: 'EEG Acquisition & Neurofeedback',
    summary:
      'An 8-channel EEG acquisition and neurofeedback prototype: a TI ADS1299 front end streamed by ESP32-S3 SPI firmware into a MATLAB pipeline and a Rest-vs-Task Random Forest classifier.',
    hook: 'ESP32-S3 SPI firmware drives a TI ADS1299 at 250 Hz into a MATLAB filtering, PSD and classification pipeline.',
    image: asset('assets/eeg-neurofeedback/matlab_ui.png'),
    imageAlt: 'MATLAB acquisition interface showing raw EEG, filtered channels, Welch PSD and model focus index',
    imageHint: 'EEG acquisition interface with raw signals, PSD, and focus index',
    thumb: asset('assets/thumbs/eeg-acquisition-neurofeedback-system.webp'),
    category: 'research',
    featured: true,
    order: 2,
    role: 'Software/firmware lead · 3-person Senior Design team, extended into M.S. EEG research at NYIT',
    technologies: ['ESP32-S3', 'TI ADS1299', 'SPI', 'MATLAB', 'Welch PSD', 'Random Forest'],
    metrics: [
      { value: '8 ch', label: '24-bit @ 250 Hz' },
      { value: '82.9%', label: 'Rest-vs-Task block accuracy' },
      { value: '33', label: 'labeled runs, 4 paradigms' },
    ],
    links: [{ label: 'Project site', href: 'https://zgeez.github.io/EEG-Based-Neurofeedback-System/' }],
  },
  {
    slug: 'led-waypoint-compass',
    title: 'LED Waypoint Compass',
    summary:
      'An ESP32-S3 handheld navigator that fuses GPS with BNO08x IMU heading and points the way on a 16-pixel LED ring, configured from a phone over BLE.',
    hook: 'Quaternion heading and great-circle bearing reduced to one lit pixel, with BLE telemetry and state that survives a reboot.',
    image: asset('assets/waypoint-compass/main.jpg'),
    imageAlt: 'LED compass ring glowing on a 3D-printed enclosure',
    imageHint: 'LED compass ring glowing on a 3D-printed enclosure',
    thumb: asset('assets/thumbs/led-waypoint-compass.webp'),
    category: 'firmware',
    featured: true,
    order: 3,
    role: 'Personal project',
    technologies: ['ESP32-S3', 'NimBLE', 'BLE NUS', 'BNO08x', 'GPS', 'NVS', 'Flutter'],
    metrics: [
      { value: '22.5°', label: 'per pixel, 16-pixel ring' },
      { value: '1 Hz', label: 'BLE telemetry' },
      { value: '2 m', label: 'arrival radius' },
    ],
  },
  {
    slug: 'electromagnetic-kinetic-7-segment-display',
    title: 'Electromagnetic Kinetic 7-Segment Display',
    shortTitle: 'Kinetic 7-Segment Display',
    summary:
      'A single-digit display whose segments are magnet-tipped bars moved by hand-wound electromagnets: pulse to change, zero current to hold.',
    hook: 'Bistable magnetic segments and XOR-diffed pulse actuation: power is spent only when a segment changes.',
    image: asset('assets/electromagnetic-display/demo-poster.jpg'),
    imageAlt: 'Kinetic seven-segment digit with raised magnetic segments in a white 3D-printed frame',
    imageHint: 'Electromagnetic Kinetic 7-Segment Display',
    thumb: asset('assets/thumbs/electromagnetic-kinetic-7-segment-display.webp'),
    category: 'firmware',
    featured: false,
    order: 4,
    technologies: ['C', 'STM32 HAL', 'H-bridge drive', 'N35 magnets', 'Fusion 360', 'KiCad'],
    metrics: [
      { value: '~12.5 mW', label: 'avg display power' },
      { value: '−70%', label: 'switching events (XOR diff)' },
    ],
  },
  {
    slug: 'smart-security-camera-raspberry-pi',
    title: 'Smart Motion-Triggered Security Camera',
    shortTitle: 'Smart Security Camera',
    summary:
      'An edge-AI security camera on Raspberry Pi 5: PIR-gated YOLOv11n person detection with event recording and a web dashboard.',
    hook: 'PIR-gated YOLOv11n on a Raspberry Pi 5, INT8-quantized with an NCNN backend.',
    image: asset('assets/security-cam/main.jpg'),
    imageAlt: 'Raspberry Pi 5 security camera with Pi Camera Module',
    imageHint: 'raspberry pi security camera system',
    thumb: asset('assets/thumbs/smart-security-camera-raspberry-pi.webp'),
    category: 'embedded-linux',
    featured: false,
    order: 5,
    technologies: ['Raspberry Pi 5', 'Linux', 'Python', 'YOLOv11n', 'NCNN'],
    metrics: [{ value: '3 → 30', label: 'FPS after optimization' }],
  },
  {
    slug: 'iot-device-automation',
    title: 'IoT Device Automation System',
    shortTitle: 'IoT Device Automation',
    summary:
      'ESP32 nodes that retrofit existing appliances and machines with AWS IoT connectivity and app-controlled automation.',
    hook: 'ESP-IDF nodes registered with AWS IoT Core over MQTT, driven from a Flutter app.',
    image: asset('assets/iot-automation/main.png'),
    imageAlt: 'IoT automation hardware and companion app',
    imageHint: 'iot circuit',
    thumb: asset('assets/thumbs/iot-device-automation.webp'),
    category: 'iot',
    featured: false,
    order: 6,
    technologies: ['ESP32', 'ESP-IDF', 'MQTT', 'AWS IoT', 'Flutter'],
  },
  {
    slug: 'nyc-dynamic-wireless-charging-roads',
    title: 'NYC Dynamic Wireless Charging Roads Simulation',
    shortTitle: 'Wireless Charging Roads Simulation',
    summary:
      'A traffic-and-power simulation of in-motion EV charging lanes on Manhattan’s 42nd Street, awarded “Most Innovative Idea” at the 2025 NYIT UREP Symposium.',
    hook: 'SUMO traffic traces fed into a MATLAB charging model to size SAE J2954 lanes on 42nd Street.',
    image: asset('assets/dwpt/main-poster.jpg'),
    imageAlt: 'SUMO traffic simulation of the 5th Avenue and 42nd Street intersection',
    imageHint: 'wireless charging road',
    thumb: asset('assets/thumbs/nyc-dynamic-wireless-charging-roads.webp'),
    category: 'research',
    featured: false,
    order: 7,
    role: 'Team lead on a 3-person research group',
    technologies: ['SUMO', 'MATLAB', 'Python'],
    metrics: [{ value: '±5%', label: 'pickup vs published field data' }],
  },
  {
    slug: 'iguard-incident-reporting-app',
    title: 'iGuard - Community Incident Reporting App',
    shortTitle: 'iGuard',
    summary:
      'A Flutter app for businesses to report security incidents, receive geo-fenced alerts and share community security information.',
    hook: 'Cross-platform Flutter and Firebase app with geo-fenced real-time alerts.',
    image: asset('assets/iguard/home.jpeg'),
    imageAlt: 'iGuard app home screen showing an incident feed',
    imageHint: 'mobile app incident reporting',
    thumb: asset('assets/thumbs/iguard-incident-reporting-app.webp'),
    category: 'software',
    featured: false,
    order: 8,
    technologies: ['Flutter', 'Firebase', 'Android', 'iOS'],
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
export const featuredProjects = sortedProjects.filter((p) => p.featured);
export const secondaryProjects = sortedProjects.filter((p) => !p.featured);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
