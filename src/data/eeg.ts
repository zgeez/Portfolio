// Verified facts for the EEG Acquisition & Neurofeedback System (Senior Design II,
// Team NeuroFocus, NYIT). Source: the project write-up and project site.
// Research results, not medical or diagnostic claims.

import type { ProbeDiagramData } from '@/components/portfolio/abstraction/probe-diagram';
import type { LensLayerMeta } from '@/components/portfolio/abstraction/abstraction-lens';

export const eegSite = 'https://zgeez.github.io/EEG-Based-Neurofeedback-System/';

export const eegHeroMetrics = [
  { value: '82.9%', label: 'Rest-vs-Task block accuracy', detail: 'best mental-math model' },
  { value: '8 ch', label: 'frontal · central · parietal', detail: 'TI ADS1299' },
  { value: '250 Hz', label: 'sampling rate', detail: '24-bit samples' },
  { value: '33', label: 'completed labeled runs', detail: '4 task paradigms' },
];

export const eegLayers: LensLayerMeta[] = [
  { id: 'product', label: 'Product', caption: 'Can a low-cost rig separate rest from task?' },
  { id: 'system', label: 'System', caption: 'Electrode to dashboard, all local' },
  { id: 'acquisition', label: 'Acquisition', caption: 'ADS1299, SPI firmware and the montage' },
  { id: 'processing', label: 'Signal processing', caption: 'Filtering, spectra, markers' },
  { id: 'classification', label: 'Classification', caption: 'Random Forest over bandpower windows' },
];

export const eegSystemDiagram: ProbeDiagramData = {
  viewBox: '0 0 640 300',
  title: 'EEG acquisition and neurofeedback signal chain',
  nodes: [
    {
      id: 'electrodes',
      label: '8 electrodes',
      sub: '10–20 sites',
      x: 20, y: 30, w: 160, h: 56,
      probe: {
        title: 'Electrode montage',
        items: [
          'F3 · Fz · F4 · C3 · Cz · C4 · P3 · P4',
          'Fpz drives bias to reduce common-mode noise',
          'TP8 references away from the measurement sites',
          'Started as a single-channel rig; moved to 8 channels for spatial coverage',
        ],
      },
    },
    {
      id: 'afe',
      label: 'TI ADS1299',
      sub: '8 ch · 24-bit',
      x: 240, y: 30, w: 160, h: 56,
      variant: 'core',
      probe: {
        title: 'ADS1299EEG-FE front end',
        items: [
          'Eight-channel, 24-bit simultaneous-sampling biopotential ADC',
          'Integrated PGAs and a bias-drive amplifier',
          'Mated to the MMB0 motherboard with the SPI header broken out',
          'Brought up against the ESP32-S3 instead of the stock DSP motherboard path',
        ],
      },
    },
    {
      id: 'mcu',
      label: 'ESP32-S3',
      sub: 'SPI master',
      x: 460, y: 30, w: 160, h: 56,
      variant: 'core',
      probe: {
        title: 'ESP32-S3 firmware',
        items: [
          'Configures the channel registers: gain, reference buffer, bias drive',
          'Starts continuous conversion (RDATAC)',
          'Reads each 27-byte frame on the DRDY interrupt',
          'Forwards framed binary packets over USB serial at 250 Hz',
        ],
      },
    },
    {
      id: 'link',
      label: 'USB serial',
      sub: 'binary packets',
      x: 480, y: 128, w: 120, h: 46,
      variant: 'link',
      probe: {
        title: 'Stream',
        items: [
          'Status word + 8 × 24-bit signed samples per frame',
          '250 Hz, framed binary packets',
          'Drop counting on both ends for stream integrity',
        ],
      },
    },
    {
      id: 'matlab',
      label: 'MATLAB',
      sub: 'filter · PSD · markers',
      x: 460, y: 216, w: 160, h: 56,
      probe: {
        title: 'Acquisition & processing',
        items: [
          'Parses packets, converts counts to microvolts',
          'High-pass 0.2 Hz → 59–61 Hz notch → band-pass 1–50 Hz',
          'Welch PSD and bandpower; artifact gating',
          'Launches tasks, writes synchronized markers, logs every run',
        ],
      },
    },
    {
      id: 'model',
      label: 'Random Forest',
      sub: 'P(Task) → threshold',
      x: 240, y: 216, w: 160, h: 56,
      probe: {
        title: 'Classifier',
        items: [
          'Bandpower features from 5 s windows, 2.5 s step, all 8 channels',
          'Outputs P(Task); a tuned threshold gives Rest or Task',
          'Block accuracy aggregates windows across a full block',
          'Best mental-math model: 82.9% block accuracy',
        ],
      },
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      sub: 'Electron · React',
      x: 20, y: 216, w: 160, h: 56,
      probe: {
        title: 'Teacher & student views',
        items: [
          'Teacher: device state, engagement-proxy history, calibration, session scripting',
          'Student: the current prompt only',
          'Live serial, mock and replay modes',
          'Full live-inference integration is still outstanding',
        ],
      },
    },
  ],
  edges: [
    { id: 'e-afe', from: 'electrodes', to: 'afe', d: 'M180 58 H240', flow: true },
    { id: 'afe-mcu', from: 'afe', to: 'mcu', d: 'M400 58 H460', label: 'SPI', lx: 430, ly: 50, flow: true },
    { id: 'mcu-link', from: 'mcu', to: 'link', d: 'M540 86 V128', flow: true },
    { id: 'link-matlab', from: 'link', to: 'matlab', d: 'M540 174 V216', flow: true },
    { id: 'matlab-model', from: 'matlab', to: 'model', d: 'M460 244 H400', flow: true },
    { id: 'model-dash', from: 'model', to: 'dashboard', d: 'M240 244 H180' },
  ],
  annotations: [
    { x: 20, y: 160, text: 'every stage runs locally: no cloud dependency' },
  ],
};

/** Approximate top-down 10–20 positions on a unit head; lead colours from the montage table. */
export const eegMontage = [
  { site: 'F3', ch: 'CH1', color: '#ff5a5a', x: -0.38, y: -0.48 },
  { site: 'Fz', ch: 'CH2', color: '#4ade80', x: 0, y: -0.45 },
  { site: 'F4', ch: 'CH3', color: '#b08968', x: 0.38, y: -0.48 },
  { site: 'C3', ch: 'CH4', color: '#60a5fa', x: -0.46, y: 0 },
  { site: 'Cz', ch: 'CH5', color: '#e879f9', x: 0, y: 0 },
  { site: 'C4', ch: 'CH6', color: '#facc15', x: 0.46, y: 0 },
  { site: 'P3', ch: 'CH7', color: '#fb923c', x: -0.38, y: 0.48 },
  { site: 'P4', ch: 'CH8', color: '#9ca3af', x: 0.38, y: 0.48 },
] as const;

export const eegRefs = [
  { site: 'Fpz', role: 'Bias', x: 0, y: -0.88 },
  { site: 'TP8', role: 'Ref', x: 0.86, y: 0.3 },
] as const;

export const eegFilterChain = [
  { stage: 'Parse', detail: 'binary packets' },
  { stage: 'Scale', detail: 'counts → µV' },
  { stage: 'High-pass', detail: '0.2 Hz' },
  { stage: 'Notch', detail: '59–61 Hz' },
  { stage: 'Band-pass', detail: '1–50 Hz' },
  { stage: 'Welch PSD', detail: 'per channel' },
  { stage: 'Bandpower', detail: 'δ · θ · α · β' },
  { stage: 'Artifact gate', detail: 'blink · motion' },
];

export const eegRuns = [
  { task: 'Mental math', runs: 10 },
  { task: 'Stroop', runs: 6 },
  { task: 'Go/NoGo', runs: 6 },
  { task: 'Task-switching', runs: 6 },
];

export const eegModels = [
  { model: 'Initial', tasks: 'Mental math', runs: '5', threshold: 'N/A', segment: 'N/A', block: '70.0%', gen: '55.5' },
  { model: 'Best mental-math', tasks: 'Mental math', runs: '10', threshold: '0.440', segment: '80.13%', block: '82.9%', gen: '78.2' },
  { model: 'Broad multi-task', tasks: 'All four paradigms', runs: '28', threshold: '0.530', segment: '76.47%', block: '79.4%', gen: '70.1' },
];

export const eegChallenges = [
  ['Electrode contact', 'Signal quality varied as contact shifted during setup or movement.', 'Tightened the setup procedure and added a pre-test signal check.', 'Still sensitive to motion and contact changes.'],
  ['SPI / ADS1299 bring-up', 'The data path needed exact timing and packet validation to produce valid frames.', 'Validated packet structure on the serial link and with logic-analyzer-style debugging.', 'The hardware path remains complex to reproduce.'],
  ['Marker alignment', 'Misaligned task markers quietly degrade supervised label quality.', 'Wrote markers from the task launcher and aligned them to the sample stream.', 'Bad markers can still corrupt a training set.'],
  ['Blink & motion artifacts', 'Transients can dominate a short EEG window and swamp real features.', 'Added artifact rejection and gating before feature extraction.', 'Not fully artifact-proof.'],
  ['Live vs. offline preprocessing', 'Training and live inference paths can diverge if filtering differs.', 'Documented and narrowed the mismatch between the two paths.', 'Full live inference integration is still outstanding.'],
  ['Early single-channel setup', 'The initial configuration gave too little spatial coverage to separate states.', 'Moved to the final 8-channel montage.', 'Setup takes noticeably longer than the early rig.'],
] as const;
