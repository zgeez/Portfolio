
import React from 'react';

export default function Stm32FunctionGeneratorContent() {
  return (
    <>
      <h3>Overview</h3>
      <p>This project involved the development of a high-fidelity function generator using an STM32F4 microcontroller.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Developed STM32F4 firmware for a function generator supporting sine, square, and triangle waveforms using optimized Look-Up Tables (LUTs), achieving high signal fidelity across a 1Hz–300kHz output range.</li>
        <li>Leveraged Direct Memory Access (DMA) with DAC and timer peripherals to enable precise, real-time waveform control.</li>
        <li>Enabled USB CDC interface for live waveform parameter tuning and system diagnostics.</li>
      </ul>
      <p><em>Further details and component images can be added using HTML.</em></p>
    </>
  );
}
