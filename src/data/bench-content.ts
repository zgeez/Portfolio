import { asset } from '@/data/site';
import { stm32HardwareDiagram, stm32Instruments, stm32SystemDiagram } from '@/data/stm32-msi';
import { eegSystemDiagram } from '@/data/eeg';
import { waypointSystemDiagram } from '@/data/waypoint';

export type BenchPhoto = { src: string; caption: string; kind: 'Recorded capture' | 'Hardware photo' | 'Project image' };
export const benchMedia: Record<string, BenchPhoto[]> = {
  'stm32-mixed-signal-instrument': [
    { src: asset('assets/stm32-msi/mixed_capture.png'), caption: 'Analog and digital capture on a shared timeline.', kind: 'Recorded capture' },
    { src: asset('assets/stm32-msi/workspace.png'), caption: 'Instrument workspace.', kind: 'Recorded capture' },
  ],
  'eeg-acquisition-neurofeedback-system': [
    { src: asset('assets/eeg-neurofeedback/ads1299_frontend.jpg'), caption: 'The ADS1299 EEG front end.', kind: 'Hardware photo' },
    { src: asset('assets/eeg-neurofeedback/ads1299_stack.jpg'), caption: 'The ADS1299 board and MMB0 motherboard stack.', kind: 'Hardware photo' },
    { src: asset('assets/eeg-neurofeedback/matlab_ui.webp'), caption: 'MATLAB acquisition, filtering, and spectral analysis.', kind: 'Recorded capture' },
  ],
  'led-waypoint-compass': [
    { src: asset('assets/waypoint-compass/enclosure_ring.jpg'), caption: 'The printed enclosure and 16-pixel ring.', kind: 'Hardware photo' },
    { src: asset('assets/waypoint-compass/app_and_ring.jpg'), caption: 'The device with its BLE companion app.', kind: 'Hardware photo' },
    { src: asset('assets/waypoint-compass/ring_turning.jpg'), caption: 'The ring indicating a turn.', kind: 'Hardware photo' },
  ],
};

// The details are reused directly from the existing case study architecture.
export const benchSystems = {
  'stm32-mixed-signal-instrument': stm32SystemDiagram.nodes,
  'eeg-acquisition-neurofeedback-system': eegSystemDiagram.nodes,
  'led-waypoint-compass': waypointSystemDiagram.nodes,
};

// Each instrument opens the part of the shared project it represents.
export const instrumentViews = {
  stm32: {
    summary: 'Two analog inputs captured together at 1 MS/s, with adjustable pre-trigger position and rising/falling edge triggers. The host application displays the samples and measurements.',
    hook: 'Follow the analog signal from PC4/PC5 through the ADC and DMA to the capture display.',
    specs: stm32Instruments.find((instrument) => instrument.id === 'scope')!.specs,
    architecture: stm32SystemDiagram.nodes,
  },
  board: {
    summary: 'The STM32F407 Discovery board runs the instrument firmware. Hardware timers drive ADC, DAC, and GPIO sampling; DMA moves the buffers while FreeRTOS tasks handle control and USB transport.',
    hook: 'Inspect the clock, timer synchronization, converter pins, and USB path that make the instrument work.',
    specs: ['TIM1 trigger output starts slaved TIM2', 'ADC inputs: PC4 / PC5', 'DAC outputs: PA4 / PA5', 'Logic inputs: PE7–PE14', 'USB CDC link to the host application'],
    architecture: stm32HardwareDiagram.nodes,
  },
  logic: {
    summary: 'Eight digital inputs sampled together at 9.882 MS/s. Edge and masked-pattern triggers capture digital activity; the host decodes UART, SPI, and I2C on the recorded timeline.',
    hook: 'Explore digital capture, protocol decoding, and the measured timing relationship between the analog and logic paths.',
    specs: stm32Instruments.find((instrument) => instrument.id === 'logic')!.specs,
    architecture: stm32SystemDiagram.nodes.filter((node) => ['host', 'link', 'mcu', 'logic'].includes(node.id)),
  },
};
