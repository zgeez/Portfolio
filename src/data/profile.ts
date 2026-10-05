// Homepage content: experience, education, skills and debug stories.
// Facts come from the current resume and the project write-ups.

import type { DebugStep } from '@/components/portfolio/ui';
import { stm32LatencyBug } from '@/data/stm32-msi';

export const research = {
  org: 'New York Institute of Technology',
  role: 'EEG Researcher',
  dates: 'Sep 2025 – Present',
  points: [
    'ESP32-S3 SPI firmware interfacing with the TI ADS1299 to acquire and stream eight 24-bit EEG channels at 250 Hz over USB serial.',
    'Led firmware/software development on a 3-person Senior Design team, now continuing the EEG work as M.S. research. The best mental-math Random Forest model reached 82.9% Rest-vs-Task block accuracy.',
    'Built a MATLAB acquisition pipeline for real-time filtering, Welch PSD, artifact gating, visualization, logging, and synchronized task markers.',
  ],
  tags: ['ESP32-S3', 'ADS1299', 'SPI', '8 ch · 24-bit · 250 Hz', 'MATLAB', 'Signal processing'],
  project: 'eeg-acquisition-neurofeedback-system',
};

export const experience = [
  {
    role: 'Technical AI Trainer',
    org: 'DataAnnotation',
    dates: 'Jan 2026 – Jul 2026',
    summary:
      'Evaluated 200+ AI-generated technical responses across C/C++, Python and Java, and authored 100+ programming prompts and rubrics, identifying edge cases, API misuse, and memory/timing defects.',
  },
  {
    role: 'Software Engineer',
    org: 'Self-Employed',
    dates: 'May 2024 – Jan 2026',
    summary:
      'Flutter/Firebase applications for healthcare, security and connected-device clients; AWS IoT over MQTT/HTTP for device telemetry and cloud dashboards.',
  },
];

export const education = {
  school: 'New York Institute of Technology',
  location: 'New York, NY',
  degrees: [
    { name: 'M.S. Electrical and Computer Engineering (Accelerated Program)', date: 'Expected May 2027' },
    { name: 'B.S. Electrical and Computer Engineering with Honors', date: 'May 2026' },
  ],
  honors: ['2025 NYIT UREP Innovation Award', 'Presidential Honor List', 'Dean’s Honor List', 'Dean’s Honors Program'],
};

export const credentials = {
  selected: [
    { title: 'Microcontroller and Embedded Driver Development (MCU1)', issuer: 'FastBit Academy', date: 'Jul 2025' },
    { title: 'Embedded Systems Programming on ARM Cortex-M3/M4', issuer: 'FastBit Academy', date: 'Mar 2025' },
    { title: 'Embedded Interface Design', issuer: 'University of Colorado Boulder', date: 'Aug 2025' },
    { title: 'C Programming with Linux', issuer: 'Dartmouth College', date: 'Jun 2025' },
  ],
  also: ['Computer Vision Engineer (MathWorks)', 'Software Development Lifecycle (University of Minnesota)'],
};

/** Skills as abstraction layers, each pointing at projects that demonstrate it. */
export const skillLayers: { layer: string; items: string[]; evidence: string[] }[] = [
  { layer: 'Application', items: ['Python', 'PySide6', 'MATLAB'], evidence: ['stm32-mixed-signal-instrument', 'eeg-acquisition-neurofeedback-system'] },
  { layer: 'System', items: ['FreeRTOS', 'Linux'], evidence: ['stm32-mixed-signal-instrument', 'smart-security-camera-raspberry-pi'] },
  { layer: 'Firmware', items: ['C', 'C++', 'ARM Assembly'], evidence: ['stm32-mixed-signal-instrument', 'led-waypoint-compass', 'eeg-acquisition-neurofeedback-system'] },
  { layer: 'Protocols', items: ['USB', 'BLE', 'SPI', 'I2C', 'UART', 'MQTT'], evidence: ['stm32-mixed-signal-instrument', 'led-waypoint-compass', 'eeg-acquisition-neurofeedback-system', 'iot-device-automation'] },
  { layer: 'Hardware', items: ['STM32', 'ESP32', 'MSP430', 'ATmega328', 'ARM Cortex-M'], evidence: ['stm32-mixed-signal-instrument', 'led-waypoint-compass', 'eeg-acquisition-neurofeedback-system'] },
  { layer: 'Peripherals', items: ['ADC', 'DAC', 'DMA', 'Timers', 'GPIO'], evidence: ['stm32-mixed-signal-instrument'] },
  { layer: 'Debug', items: ['JTAG/SWD', 'Oscilloscope', 'Logic analyzer', 'DMM'], evidence: ['stm32-mixed-signal-instrument', 'eeg-acquisition-neurofeedback-system'] },
  { layer: 'Tooling', items: ['CMake', 'GCC', 'Git', 'STM32CubeIDE', 'ESP-IDF', 'PlatformIO', 'KiCad'], evidence: ['stm32-mixed-signal-instrument', 'led-waypoint-compass'] },
];

export type DebugStory = {
  id: string;
  project: string;
  /** Deep link into the project page, e.g. an abstraction-lens layer. */
  anchor: string;
  title: string;
  headline: string;
  steps: DebugStep[];
};

export const debugStories: DebugStory[] = [
  {
    id: 'usb-latency',
    project: 'stm32-mixed-signal-instrument',
    anchor: 'lens-firmware',
    title: 'STM32 USB latency floor',
    headline: '20 ms → 0.22 ms',
    steps: [
      { stage: 'Symptom', text: 'Every request took almost exactly 20 ms.' },
      { stage: 'Observation', text: 'Transfers were exact multiples of it. Throughput limits don’t quantize; timeouts do.' },
      { stage: 'Root cause', text: 'tasks_notify_control() was never called from the CDC callbacks; the task woke only on its 10 ms timeout.' },
      { stage: 'Fix', text: 'Notify from RX and TX-complete callbacks, inside CubeMX user-code regions.' },
      { stage: 'Result', text: stm32LatencyBug.table[0].after + ' median RTT · 86× capture throughput' },
    ],
  },
  {
    id: 'sync-skew',
    project: 'stm32-mixed-signal-instrument',
    anchor: 'lens-signals',
    title: 'Analog/digital synchronization',
    headline: '−120 ns, explained',
    steps: [
      { stage: 'Goal', text: 'Compare a 1 MS/s analog path and a 9.882 MS/s logic path on one axis.' },
      { stage: 'Fix', text: 'TIM1’s trigger output releases a slaved TIM2: one hardware start, not two software commands.' },
      { stage: 'Measurement', text: 'Residual skew of −120 ns between the paths; no jitter resolvable above sampling quantization.' },
      { stage: 'Root cause', text: 'Matches the ADC’s 143 ns sample-and-hold aperture. A shared start is not a shared sampling instant.' },
      { stage: 'Result', text: 'Skew traced to a mechanism, not left as a residual.' },
    ],
  },
  {
    id: 'eeg-labels',
    project: 'eeg-acquisition-neurofeedback-system',
    anchor: 'lens-classification',
    title: 'EEG label and data quality',
    headline: '70.0% → 82.9%',
    steps: [
      { stage: 'Symptom', text: 'Initial 5-run model: 70.0% block accuracy, 55.5 generalization score.' },
      { stage: 'Root cause', text: 'Misaligned task markers silently poison labels; blink and motion transients swamp short windows.' },
      { stage: 'Fix', text: 'Markers written by the task launcher and aligned to the sample stream; artifact gating before features; complete 8-channel runs.' },
      { stage: 'Result', text: '82.9% block accuracy and 78.2 generalization on 10 runs, from data hygiene rather than model complexity.' },
    ],
  },
];
