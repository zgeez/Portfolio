// Verified facts for the STM32 Mixed-Signal Instrument.
// Source of truth: the project write-up, validation report and characterization
// document in github.com/zgeez/stm32-mixed-signal-instrument. Nothing here is
// estimated; anything illustrative is labelled where it is rendered.

import type { ProbeDiagramData } from '@/components/portfolio/abstraction/probe-diagram';
import type { LensLayerMeta } from '@/components/portfolio/abstraction/abstraction-lens';

export const stm32Links = {
  repo: 'https://github.com/zgeez/stm32-mixed-signal-instrument',
  releases: 'https://github.com/zgeez/stm32-mixed-signal-instrument/releases',
};

export const stm32Metrics = {
  logicRate: { value: '9.882 MS/s', label: 'logic capture', detail: '8 channels, sampled together' },
  latency: { value: '0.22 ms', exact: '0.221 ms', label: 'median command RTT', detail: 'down from 19.997 ms' },
  throughput: { value: '206 kB/s', label: 'capture throughput', detail: 'up from 2.40 kB/s' },
  skew: { value: '−120 ns', label: 'analog/digital skew', detail: 'shared hardware start' },
  dma: { value: '4', label: 'concurrent DMA streams', detail: 'DAC, dual ADC, GPIO sampling' },
  tasks: { value: '4', label: 'FreeRTOS tasks' },
  commands: { value: '28', label: 'protocol commands' },
  ddsStep: { value: '93.13 µHz', label: 'frequency step', detail: '32-bit DDS accumulator' },
  pythonTests: { value: '206', label: 'Python tests' },
  cSuites: { value: '9', label: 'C unit suites' },
  cCoverage: { value: '92.8%', label: 'C line coverage' },
  pyCoverage: { value: '89%', label: 'Python coverage' },
  validationRecords: { value: '28', label: 'validation records' },
} as const;

/** Headline metrics shown on the project header and Product layer. */
export const stm32HeroMetrics = [
  stm32Metrics.logicRate,
  stm32Metrics.latency,
  stm32Metrics.throughput,
  stm32Metrics.skew,
];

export const stm32Layers: LensLayerMeta[] = [
  { id: 'product', label: 'Product', caption: 'What it is and what it measures' },
  { id: 'system', label: 'System', caption: 'Host, link and instrument blocks' },
  { id: 'firmware', label: 'Firmware', caption: 'Tasks, DMA and the protocol path' },
  { id: 'hardware', label: 'Hardware', caption: 'Timers, converters and pins' },
  { id: 'signals', label: 'Signals', caption: 'One capture, one timeline' },
];

export const stm32Instruments = [
  {
    id: 'awg',
    name: 'Waveform Generator',
    short: 'AWG',
    specs: [
      '2 outputs on PA4 and PA5',
      '1 Hz to 20 kHz, 93.13 µHz step',
      'Sine, triangle, square, sawtooth, DC',
      '2–256 entry arbitrary tables',
      'Circular DMA, 1.28 ms refill deadline',
    ],
  },
  {
    id: 'scope',
    name: 'Oscilloscope',
    short: 'SCOPE',
    specs: [
      '2 inputs on PC4 and PC5',
      '1 MS/s on two channels',
      '64 to 2048 simultaneous sample pairs',
      'Free-run, rising and falling triggers',
      'Adjustable pre-trigger position',
    ],
  },
  {
    id: 'logic',
    name: 'Logic Analyzer',
    short: 'LOGIC',
    specs: [
      '8 inputs on PE7 to PE14',
      '9.882 MS/s, sampled together',
      '64 to 4096 samples',
      'Edge and masked-pattern triggers',
      'UART, SPI and I2C decoding',
    ],
  },
];

/* ───────────── L1: System architecture ───────────── */

export const stm32SystemDiagram: ProbeDiagramData = {
  viewBox: '0 0 640 400',
  title: 'STM32 Mixed-Signal Instrument system architecture',
  nodes: [
    {
      id: 'host',
      label: 'PC Application',
      sub: 'Python · PySide6',
      x: 220, y: 16, w: 200, h: 58,
      probe: {
        title: 'Host application',
        items: [
          'PySide6 desktop application and a CLI',
          'Configures outputs, pulls captures, measures them and decodes serial traffic',
          'Ships as a single Windows executable that flashes the board’s firmware itself',
          'Warns on firmware version mismatch, naming both versions and staying connected',
        ],
      },
    },
    {
      id: 'link',
      label: 'USB CDC',
      sub: 'COBS-framed binary',
      x: 250, y: 120, w: 140, h: 46,
      variant: 'link',
      probe: {
        title: 'USB CDC link',
        items: [
          'Versioned binary protocol, 28 commands',
          'COBS framing over USB CDC',
          'Native CDC port, separate from ST-LINK',
          'Post-fix median command round trip: 0.221 ms',
        ],
      },
    },
    {
      id: 'mcu',
      label: 'STM32F407 + FreeRTOS',
      sub: 'ARM Cortex-M4',
      x: 200, y: 212, w: 240, h: 58,
      variant: 'core',
      probe: {
        title: 'STM32F407VGT6',
        items: [
          'ARM Cortex-M4, firmware in C on FreeRTOS',
          'Four tasks: waveform refill, acquisition, USB control, status',
          'Four concurrent DMA streams across DAC, dual ADC and GPIO sampling',
          'Chained hardware timers provide the shared capture start',
        ],
      },
    },
    {
      id: 'awg',
      label: 'AWG',
      sub: '2 ch · DAC',
      x: 40, y: 326, w: 150, h: 54,
      probe: {
        title: 'Waveform generator',
        items: [
          'Two outputs on PA4 and PA5, 1 Hz to 20 kHz',
          '32-bit phase accumulator clocked at 400 kS/s: 93.13 µHz step',
          'Circular DMA with a 1.28 ms refill deadline',
          'Runs alongside either acquisition mode',
        ],
      },
    },
    {
      id: 'scope',
      label: 'SCOPE',
      sub: '2 ch · ADC',
      x: 245, y: 326, w: 150, h: 54,
      probe: {
        title: 'Oscilloscope',
        items: [
          'Two analog inputs on PC4 and PC5',
          '1 MS/s on two channels, ADC + DMA',
          '64 to 2048 simultaneous sample pairs',
          'Pre-trigger support; scope and logic acquisition modes are mutually exclusive',
        ],
      },
    },
    {
      id: 'logic',
      label: 'LOGIC',
      sub: '8 ch · GPIO',
      x: 450, y: 326, w: 150, h: 54,
      probe: {
        title: 'Logic analyzer',
        items: [
          'Eight inputs on PE7 to PE14, sampled together',
          '9.882 MS/s, GPIO sampling + DMA',
          'Edge and masked-pattern triggers',
          'UART, SPI and I2C decoding',
        ],
      },
    },
  ],
  edges: [
    { id: 'host-link', from: 'host', to: 'link', d: 'M320 74 V120', flow: true },
    { id: 'link-mcu', from: 'link', to: 'mcu', d: 'M320 166 V212', flow: true },
    { id: 'mcu-awg', from: 'mcu', to: 'awg', d: 'M280 270 V298 H115 V326' },
    { id: 'mcu-scope', from: 'mcu', to: 'scope', d: 'M320 270 V326' },
    { id: 'mcu-logic', from: 'mcu', to: 'logic', d: 'M360 270 V298 H525 V326' },
  ],
  annotations: [
    { x: 422, y: 316, text: 'scope ⟷ logic modes: mutually exclusive', anchor: 'middle' },
    { x: 115, y: 395, text: 'runs alongside either', anchor: 'middle' },
  ],
};

/* ───────────── L2: Firmware ───────────── */

export const stm32Tasks = [
  {
    id: 'refill',
    name: 'Waveform refill',
    items: [
      'Keeps the DAC’s circular DMA buffer fed, half by half',
      '1.28 ms refill deadline',
      'A missed half faults and stops the timer rather than repeating stale samples',
    ],
  },
  {
    id: 'acquisition',
    name: 'Acquisition',
    items: [
      'Scope (dual ADC + DMA) or logic (GPIO + DMA), never both at once',
      'Each stream reports where its window begins relative to the shared start',
    ],
  },
  {
    id: 'control',
    name: 'USB control',
    items: [
      'Services the host’s binary protocol over USB CDC',
      'Woken by task notification from the CDC RX/TX-complete callbacks',
      'Otherwise runs on a 10 ms idle timeout',
    ],
  },
  {
    id: 'status',
    name: 'Status',
    items: ['Runs in its own task, separate from the data paths'],
  },
];

export const stm32BoardChecks = [
  'Concurrent load',
  'Stack headroom',
  'Refill latency',
  'Fault recovery',
  'USB backpressure',
];

export const stm32LatencyBug = {
  title: 'Finding a 20 ms latency floor',
  steps: [
    { stage: 'Symptom', text: 'Every request to the device took almost exactly 20 ms.' },
    {
      stage: 'Observation',
      text: 'A capture transfer was always an exact multiple of that figure.',
    },
    {
      stage: 'Hypothesis',
      text: 'A genuine throughput limit does not quantize that cleanly, but a timeout does: look at the scheduling path, not bandwidth.',
    },
    {
      stage: 'Root cause',
      text: 'tasks_notify_control() was defined and declared but never called from the CDC callbacks, so the control task ran only on its 10 ms idle timeout and reception was not rearmed until it did. The transmit-complete callback had the same gap.',
      code: 'tasks_notify_control()',
    },
    {
      stage: 'Fix',
      text: 'Notify the control task from both the RX and TX-complete callbacks, inside the CubeMX user-code regions so the fix survives regeneration.',
    },
    { stage: 'Result', text: '19.997 ms → 0.221 ms median command round trip; 2.40 → 206 kB/s capture throughput.' },
  ],
  table: [
    { measurement: 'Command round trip, median', before: '19.997 ms', after: '0.221 ms', change: '90×' },
    { measurement: 'Transfer, 2048 samples', before: '3419.7 ms', after: '39.79 ms', change: '86×' },
    { measurement: 'Capture throughput', before: '2.40 kB/s', after: '206 kB/s', change: '86×' },
  ],
  note: 'Across four runs the idle median moved between 0.22 and 0.26 ms and throughput between 186 and 206 kB/s, so the figures above are one run rather than a best case pulled from many.',
};

/* ───────────── L3: Hardware ───────────── */

export const stm32HardwareDiagram: ProbeDiagramData = {
  viewBox: '0 0 640 430',
  title: 'STM32F407 peripheral relationships',
  nodes: [
    {
      id: 'clock',
      label: 'Crystal',
      sub: 'one clock source',
      x: 20, y: 20, w: 130, h: 50,
      probe: {
        title: 'One clock for every rate',
        items: [
          'Every timer on the device divides the same crystal',
          'That is what makes a shared timebase possible',
          'Consequence: a frequency error is invisible from inside the device, so independent time-base accuracy is unmeasured',
        ],
      },
    },
    {
      id: 'tim1',
      label: 'TIM1',
      sub: 'trigger output',
      x: 210, y: 20, w: 130, h: 50,
      probe: {
        title: 'TIM1 → TIM2',
        items: [
          'TIM1’s trigger output releases a slaved TIM2',
          'Logic and analog capture start from one hardware event, not two software commands',
          'Only one stream holds the trigger; the other free-runs and is placed by index',
        ],
      },
    },
    {
      id: 'tim2',
      label: 'TIM2',
      sub: 'slaved',
      x: 400, y: 20, w: 130, h: 50,
      probe: {
        title: 'Slaved timer',
        items: [
          'Started by TIM1’s trigger output rather than by software',
          'Together they form the shared hardware start',
        ],
      },
    },
    {
      id: 'mcu',
      label: 'STM32F407VGT6',
      sub: 'Cortex-M4 · 4 DMA streams',
      x: 180, y: 150, w: 280, h: 66,
      variant: 'core',
      probe: {
        title: 'DMA',
        items: [
          'Four concurrent DMA streams across DAC, dual ADC and GPIO sampling',
          'Sample loss bounded below 1 in 81,000 with no isolated drops (worst of four rates, 30 captures each)',
          'Stream-to-controller mapping is not shown here because it is not documented in the write-up',
        ],
      },
    },
    {
      id: 'dac',
      label: 'DAC + DMA',
      sub: 'PA4 · PA5',
      x: 20, y: 300, w: 140, h: 56,
      probe: {
        title: 'DAC outputs',
        items: [
          'Two waveform outputs on PA4 and PA5',
          'Fed by circular DMA',
          'PA4 is loaded by the board’s audio codec connection',
        ],
      },
    },
    {
      id: 'adc',
      label: 'Dual ADC + DMA',
      sub: 'PC4 · PC5',
      x: 180, y: 300, w: 140, h: 56,
      probe: {
        title: 'Scope inputs',
        items: [
          'Two analog inputs on PC4 and PC5',
          '1 MS/s on two channels, simultaneous sample pairs',
          '143 ns sample-and-hold aperture',
        ],
      },
    },
    {
      id: 'gpio',
      label: 'GPIO + DMA',
      sub: 'PE7 – PE14',
      x: 340, y: 300, w: 140, h: 56,
      probe: {
        title: 'Logic inputs',
        items: [
          'Eight inputs on PE7 to PE14, read as one port',
          '9.882 MS/s',
          'Reads land when DMA wins the bus, not exactly at the timer edge; the 10 MS/s setting is experimental',
        ],
      },
    },
    {
      id: 'usb',
      label: 'USB FS',
      sub: 'CDC device',
      x: 500, y: 300, w: 120, h: 56,
      probe: {
        title: 'USB',
        items: [
          'Native USB CDC port, separate from the ST-LINK debugger',
          'Carries the COBS-framed binary protocol',
        ],
      },
    },
  ],
  edges: [
    { id: 'clock-tim1', from: 'clock', to: 'tim1', d: 'M150 45 H210' },
    { id: 'tim1-tim2', from: 'tim1', to: 'tim2', d: 'M340 45 H400', label: 'TRGO', lx: 370, ly: 38, flow: true },
    { id: 'tim-mcu', from: 'tim1', to: 'mcu', d: 'M275 70 V150' },
    { id: 'tim2-mcu', from: 'tim2', to: 'mcu', d: 'M465 70 V110 H400 V150' },
    { id: 'mcu-dac', from: 'mcu', to: 'dac', d: 'M220 216 V258 H90 V300' },
    { id: 'mcu-adc', from: 'mcu', to: 'adc', d: 'M260 216 V300' },
    { id: 'mcu-gpio', from: 'mcu', to: 'gpio', d: 'M380 216 V300' },
    { id: 'mcu-usb', from: 'mcu', to: 'usb', d: 'M420 216 V258 H560 V300' },
  ],
  annotations: [
    { x: 320, y: 394, text: 'shared hardware start → ADC and GPIO capture on one timeline', anchor: 'middle' },
  ],
};

export const stm32Pins = [
  { block: 'AWG', pins: 'PA4, PA5', peripheral: 'DAC + DMA' },
  { block: 'Scope', pins: 'PC4, PC5', peripheral: 'Dual ADC + DMA' },
  { block: 'Logic', pins: 'PE7 – PE14', peripheral: 'GPIO sampling + DMA' },
  { block: 'Host link', pins: 'USB FS', peripheral: 'USB CDC' },
];

/* ───────────── L4: Signals ───────────── */

/** Stream windows read from the timeline table in mixed_capture.png. */
export const stm32CaptureWindows = [
  { id: 'analog', label: 'Analog CH1', rate: '1.000 MS/s', samplesPerUs: 1, samples: 512, startUs: -249.14, endUs: 261.86 },
  { id: 'digital', label: 'Digital D0–D7', rate: '9.882 MS/s', samplesPerUs: 9.882, samples: 4096, startUs: -207.24, endUs: 207.14 },
] as const;

/** "Both streams cover 414.38 µs; outside that only one stream has data." (capture timeline table) */
export const stm32OverlapUs = 414.38;

/**
 * Calibration of mixed_capture.png's own time axis, as fractions of the image size.
 * Read from its tick labels: −250 µs and +250 µs sit at 38.40% and 94.85% of the width.
 */
export const mixedCaptureAxis = {
  zeroX: 0.66625,
  widthPerUs: 0.001129,
  plotTop: 0.215,
  plotBottom: 0.78,
  minUs: -260,
  maxUs: 270,
};

export const stm32Timing = {
  skewNs: -120,
  apertureNs: 143,
  logicPeriodNs: 101.2, // 1 / 9.882 MS/s
  analogPeriodNs: 1000, // 1 / 1.000 MS/s
};

export const stm32Validation = {
  tests: [
    '206 Python tests',
    '9 C unit suites compiling the real firmware sources on the host',
    'All running in CI',
    'Suites also run under AddressSanitizer and UndefinedBehaviorSanitizer',
  ],
  records: [
    '92.8% line coverage on C',
    '89% on Python',
    '28-record validation report',
    'Characterization document with stated error budgets and explicit limits',
  ],
};

export const stm32Limits = [
  {
    area: 'Analog accuracy',
    notEstablished: 'Absolute amplitude accuracy, distortion and bandwidth are uncharacterized.',
    why: 'Loopback alone cannot isolate which path contributes an error, and PA4 is loaded by the board’s audio codec connection.',
  },
  {
    area: 'Time-base accuracy',
    notEstablished: 'Independent time-base accuracy is unmeasured.',
    why: 'Every rate divides one crystal, so a frequency error is invisible from inside the device.',
  },
  {
    area: 'Short pulses',
    notEstablished: 'Asynchronous pulse limits are uncharacterized; a short pulse can be missed without a DMA error.',
    why: 'GPIO reads land when DMA wins the bus rather than exactly at the timer edge. The 10 MS/s setting is experimental.',
  },
  {
    area: 'Protocol decoding',
    notEstablished: 'Decoder checks used generated patterns, not independent external devices.',
    why: 'UART, SPI and I2C decoding was exercised against the instrument’s own outputs.',
  },
  {
    area: 'Skew reference',
    notEstablished: 'Skew bounds the two acquisition paths against each other, not against an independent time base.',
    why: 'It is measured against the device’s own reference output, which shares the sampler’s clock.',
  },
];
