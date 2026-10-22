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
    { title: 'Computer Vision Engineer', issuer: 'MathWorks', date: '' },
    { title: 'Software Development Lifecycle', issuer: 'University of Minnesota', date: '' },
  ],

};

/** Skills grouped by abstraction layer. */
export const skillLayers: { layer: string; items: string[] }[] = [
  { layer: 'Application', items: ['Python', 'PySide6', 'MATLAB'] },
  { layer: 'System', items: ['FreeRTOS', 'Linux'] },
  { layer: 'Firmware', items: ['C', 'C++', 'ARM Assembly'] },
  { layer: 'Protocols', items: ['USB', 'BLE', 'SPI', 'I2C', 'UART', 'MQTT'] },
  { layer: 'Hardware', items: ['STM32', 'ESP32', 'MSP430', 'ATmega328', 'ARM Cortex-M'] },
  { layer: 'Peripherals', items: ['ADC', 'DAC', 'DMA', 'Timers', 'GPIO'] },
  { layer: 'Debug', items: ['JTAG/SWD', 'Oscilloscope', 'Logic analyzer', 'DMM'] },
  { layer: 'Tooling', items: ['CMake', 'GCC', 'Git', 'STM32CubeIDE', 'ESP-IDF', 'PlatformIO', 'KiCad'] },
];

export type DebugStory = {
  id: string;
  project: string;
  /** Direct anchor to the corresponding project postmortem. */
  anchor: string;
  title: string;
  headline: string;
  steps: DebugStep[];
};

export const debugStories: DebugStory[] = [
  {
    id: 'badge-upload-watchdog',
    project: 'smart-led-badge',
    anchor: 'postmortem-badge-upload',
    title: 'Pixel Badge upload and scan timing',
    headline: '93 frames uploaded and read back',
    steps: [
      { stage: 'Symptom', text: 'A large animation upload stopped and the nRF5340 DK entered watchdog-loop safe mode.' },
      { stage: 'Timing hazard', text: 'The shortest row timer started before shifting finished. A compare could expire inside the ISR and starve the watchdog thread.' },
      { stage: 'Fix', text: 'Start the row slot after shifting. Separately, negotiate MTU before artwork readback to remove a misleading reconnect delay.' },
      { stage: 'Result', text: 'A 93-frame, 36,297-byte clip uploaded and read back, with scan progress observed afterward.' },
      { stage: 'Scope', text: 'One DK/app recovery transaction. The original first watchdog trigger was not captured; this was not a soak test.' },
    ],
  },
  {
    id: 'badge-port-contract',
    project: 'smart-led-badge',
    anchor: 'postmortem-badge-port',
    title: 'Pixel Badge processor port',
    headline: '43 schematic pads checked',
    steps: [
      { stage: 'Constraint', text: 'Parts availability forced a move from the nRF5340 development rig to an nRF52840 module, tightening both GPIO and flash budgets.' },
      { stage: 'Check', text: 'Compare the compiled configuration against all 43 module schematic pads.' },
      { stage: 'Regression', text: 'Add negative checks that reject incorrect latch pins and overlapping flash partitions.' },
      { stage: 'Result', text: 'Both target builds fit their recorded budgets, with incorrect pin and partition inputs rejected.' },
      { stage: 'Scope', text: 'Build and configuration consistency. Physical bring-up of the custom board remains a separate test.' },
    ],
  },
  {
    id: 'badge-i2c-timing',
    project: 'smart-led-badge',
    anchor: 'postmortem-badge-i2c',
    title: 'Pixel Badge charger bus timing',
    headline: '400 kHz to 100 kHz',
    steps: [
      { stage: 'Observation', text: 'A successful I2C response alone could not establish correct charger behavior across power states.' },
      { stage: 'Requirement', text: 'The BQ25620 charger requires additional low-power bus timing at 400 kHz that the controller could not insert.' },
      { stage: 'Fix', text: 'Move the shared charger/IMU bus to 100 kHz and keep sensing freshness visible to power policy.' },
      { stage: 'Scope', text: 'A datasheet-driven timing correction. One successful bench response does not validate every power state.' },
    ],
  },
  {
    id: 'usb-latency',
    project: 'stm32-mixed-signal-instrument',
    anchor: 'postmortem-usb-latency',
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
    anchor: 'postmortem-sync-skew',
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
    anchor: 'postmortem-eeg-labels',
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
