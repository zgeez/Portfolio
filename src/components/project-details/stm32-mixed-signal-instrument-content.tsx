import Image from 'next/image';
import React from 'react';

const Stm32MixedSignalInstrumentContent: React.FC = () => (
  <article className="container mx-auto px-4 py-0 prose lg:prose-lg">
    {/* ────────────── Header ────────────── */}
    <header className="mb-10">
      <p className="text-gray-600">
        A USB bench instrument built on an STM32F407 Discovery board and paired with a desktop application.
        One device provides a 2-channel arbitrary waveform generator, a 2-channel oscilloscope, an 8-channel
        logic analyzer, and a combined mode that puts analog and digital capture on a{' '}
        <strong>single shared timeline</strong>, with a measured start skew of <strong>-120 ns</strong>.
      </p>
      <p className="text-sm text-gray-500">
        Firmware in C on FreeRTOS · Desktop application in Python with PySide6<br />
      </p>
      <p>
        <a
          href="https://github.com/zgeez/stm32-mixed-signal-instrument"
          target="_blank"
          rel="noopener noreferrer"
        >
          Repository →
        </a>
        {' · '}
        <a
          href="https://github.com/zgeez/stm32-mixed-signal-instrument/releases"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download the application and firmware →
        </a>
      </p>
    </header>

    {/* ────────────── Hero Image ────────────── */}
    <figure className="mb-12 flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/stm32-msi/workspace.png`}
        alt="Desktop application window: waveform generator controls for outputs PA4 and PA5 on the left, and on the right an oscilloscope capture of a 10 kHz sine at 1 MS/s with min, max, mean, RMS, Vpp, frequency and period readouts beneath it"
        width={1400}
        height={900}
        className="rounded-xl shadow-lg w-full max-w-4xl"
        priority
      />
      <figcaption className="text-center text-sm mt-2">
        Generator controls on the left, capture display on the right; here a 10 kHz sine measured at 9999.822 Hz
      </figcaption>
    </figure>

    {/* ────────────── Project Overview ────────────── */}
    <h2>Project Overview</h2>
    <p>
      A student who wants to see a signal usually needs three separate instruments, and the bench that has all
      three is the one they cannot take home. This project asked whether one board they already own can do the
      work: <strong>generate, capture, and correlate analog and digital signals from a single device</strong>,
      driven by an application on the host.
    </p>
    <p>
      The answer required the whole chain. Firmware in C on FreeRTOS runs four tasks and coordinates seven
      concurrent DMA streams across the DAC, dual ADC, and GPIO sampling. A versioned binary protocol carries
      28 commands over USB CDC. A PySide6 desktop application configures the outputs, pulls captures, measures
      them, and decodes serial traffic. It ships as a single Windows executable that flashes the board&apos;s
      firmware itself.
    </p>
    <p className="text-sm text-gray-500">
      <em>
        This is an unprotected low-voltage prototype, not a product. Inputs must stay within the board&apos;s own
        supply and reference limits: no mains, negative-voltage, or automotive inputs.
      </em>
    </p>

    {/* ────────────── Measured Results ────────────── */}
    <div className="bg-green-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4 text-green-800">Measured Results</h3>
      <div className="grid md:grid-cols-4 gap-4 text-center">
        <div>
          <h4 className="text-2xl font-bold text-green-700">-120 ns</h4>
          <p className="text-sm text-green-600">Analog/Digital Skew<br/>Shared Hardware Start</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">9.882 MS/s</h4>
          <p className="text-sm text-green-600">Logic Capture<br/>8 Channels</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">0.22 ms</h4>
          <p className="text-sm text-green-600">Median Command Latency<br/>Down from 20 ms</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">93.13 µHz</h4>
          <p className="text-sm text-green-600">Frequency Step<br/>32-bit DDS Accumulator</p>
        </div>
      </div>
    </div>

    {/* ────────────── Shared Timebase ────────────── */}
    <h2>One Timeline for Analog and Digital</h2>
    <p>
      The distinctive part of the instrument is not the instrument count, it is that two capture paths running at
      different rates can be compared against each other. Every timer on the device divides the same crystal, which
      is what makes a shared timebase possible in the first place. <strong>TIM1&apos;s trigger output releases a
      slaved TIM2</strong>, so a logic capture and an analog capture start from one hardware event rather than from
      two software commands that happen to be close together.
    </p>
    <p>
      Each stream then reports where its own window begins relative to that shared start, and the application draws
      both against one axis with zero at the trigger. Only one stream holds the trigger; the other free-runs and is
      placed by index. Where the two windows do not overlap, the display says so rather than leaving the reader to
      infer it.
    </p>

    <figure className="mb-8 flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/stm32-msi/mixed_capture.png`}
        alt="Mixed capture view: a sine on analog channel CH1 plotted above eight logic traces D0 to D7, both against time from trigger in microseconds, with a timeline table reporting the analog stream at 1.000 MS/s covering -249.14 to +261.86 microseconds and the digital stream at 9.882 MS/s covering -207.24 to +207.14 microseconds"
        width={1400}
        height={900}
        className="rounded-lg shadow-lg w-full max-w-4xl"
      />
      <figcaption className="text-center text-sm mt-2">
        One sine reaching both an analog input and a logic input: the wave above, its threshold crossings on D0
        below, and a timeline reporting what each stream covers and where they overlap
      </figcaption>
    </figure>

    <div className="bg-yellow-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-3 text-yellow-800">
        A Shared Start Is Not a Shared Sampling Instant
      </h3>
      <p className="text-sm text-yellow-900 mb-0">
        Measured skew between the two paths is <strong>-120 ns</strong>. That figure is not noise and it is not a
        defect: it matches the ADC&apos;s 143 ns sample-and-hold aperture, so the number was traced to a specific
        mechanism rather than left as a residual. No jitter is resolvable above the sampling quantization. The skew
        is measured against the device&apos;s own reference output, which shares the sampler&apos;s clock, so it
        bounds the two acquisition paths against each other rather than against an independent time base.
      </p>
    </div>

    {/* ────────────── The Instruments ────────────── */}
    <h2>The Instruments</h2>
    <div className="bg-gray-50 p-6 rounded-lg my-8">
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Waveform Generator</h4>
          <ul>
            <li> 2 outputs on PA4 and PA5</li>
            <li> 1 Hz to 20 kHz, 93.13 µHz step</li>
            <li> Sine, triangle, square, sawtooth, DC</li>
            <li> 2–256 entry arbitrary tables</li>
            <li> Circular DMA, 1.28 ms refill deadline</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Oscilloscope</h4>
          <ul>
            <li> 2 inputs on PC4 and PC5</li>
            <li> 1 MS/s on two channels</li>
            <li> 64 to 2048 simultaneous sample pairs</li>
            <li> Free-run, rising and falling triggers</li>
            <li> Adjustable pre-trigger position</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Logic Analyzer</h4>
          <ul>
            <li> 8 inputs on PE7 to PE14</li>
            <li> 9.882 MS/s, sampled together</li>
            <li> 64 to 4096 samples</li>
            <li> Edge and masked-pattern triggers</li>
            <li> UART, SPI and I2C decoding</li>
          </ul>
        </div>
      </div>
    </div>
    <p>
      The generator uses a <strong>32-bit phase accumulator clocked at 400 kS/s</strong>, which gives a frequency
      step of 93.13 µHz, finer than the millihertz the protocol accepts. A refill that misses its half faults and
      stops the timer rather than repeating stale samples, so a missed deadline is reported instead of quietly
      producing a wrong waveform. Scope and logic acquisition are mutually exclusive; the generator runs alongside
      either.
    </p>

    {/* ────────────── Firmware & Protocol ────────────── */}
    <h2>Firmware &amp; Host Protocol</h2>
    <div className="grid md:grid-cols-2 gap-6 my-8">
      <section className="bg-blue-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-blue-800">🔹 Device</h3>
        <ul className="text-sm">
          <li> STM32F407VGT6, ARM Cortex-M4</li>
          <li> Bare-metal C with FreeRTOS, four tasks</li>
          <li> 7 concurrent DMA streams</li>
          <li> DAC, dual ADC and GPIO sampling</li>
          <li> Chained timers for the shared start</li>
        </ul>
      </section>

      <section className="bg-purple-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-purple-800">🔹 Link</h3>
        <ul className="text-sm">
          <li> Versioned binary protocol, 28 commands</li>
          <li> COBS framing over USB CDC</li>
          <li> Native CDC port, separate from ST-LINK</li>
          <li> Version mismatch named, not guessed at</li>
          <li> PySide6 desktop application and a CLI</li>
        </ul>
      </section>
    </div>
    <p>
      Waveform refill, acquisition, USB control and status are separated into their own FreeRTOS tasks. Board
      checks cover concurrent load, stack headroom, refill latency, fault recovery and USB backpressure. The
      application warns when firmware is older than it expects, naming both versions and staying connected, on the
      reasoning that a mismatch may not matter to what you are doing but you should know it is there.
    </p>

    {/* ────────────── The USB Latency Bug ────────────── */}
    <h2>Finding a 20 ms Latency Floor</h2>
    <p>
      Every request to the device was taking almost exactly 20 ms, and a capture transfer was always an exact
      multiple of that figure. An exact multiple is the useful clue: a genuine throughput limit does not quantize
      that cleanly, but a timeout does.
    </p>
    <p>
      The cause was a single missing call. <code>tasks_notify_control()</code> was defined and declared but never
      called from the CDC callbacks, so the control task ran only on its <strong>10 ms idle timeout</strong> and
      reception was not rearmed until it did. Every request waited for that timer instead of the interrupt that
      should have woken it. The transmit-complete callback had the same gap. Calling the notify from both, inside
      the CubeMX user-code regions so the fix survives regeneration, removed the floor.
    </p>

    <div className="overflow-x-auto my-8">
      <table className="text-sm w-full">
        <thead>
          <tr>
            <th>Measurement</th>
            <th>Before</th>
            <th>After</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Command round trip, median</td>
            <td>19.997 ms</td>
            <td><strong>0.221 ms</strong></td>
            <td>90x</td>
          </tr>
          <tr>
            <td>Transfer, 2048 samples</td>
            <td>3419.7 ms</td>
            <td><strong>39.79 ms</strong></td>
            <td>86x</td>
          </tr>
          <tr>
            <td>Capture throughput</td>
            <td>2.40 kB/s</td>
            <td><strong>206 kB/s</strong></td>
            <td>86x</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="text-sm text-gray-500">
      <em>
        Across four runs the idle median moved between 0.22 and 0.26 ms and throughput between 186 and 206 kB/s,
        so the figures above are one run rather than a best case pulled from many.
      </em>
    </p>

    {/* ────────────── Validation ────────────── */}
    <h2>Measured Rather Than Declared</h2>
    <p>
      The part of this project that took the most work is the part that does not appear in the feature list: showing
      that the instrument does what it says. Sample loss is the clearest example. Rather than assume the DMA paths
      keep up, loss was <strong>bounded below 1 in 81,000 samples with no isolated drops</strong>, measured against
      an on-board timer reference across the worst of four rates, 30 captures each.
    </p>

    <div className="bg-gray-50 p-6 rounded-lg my-8">
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Automated Tests</h4>
          <ul>
            <li> 206 Python tests</li>
            <li> 9 C unit suites compiling the real firmware sources on the host</li>
            <li> All running in CI</li>
            <li> Suites also run under AddressSanitizer and UndefinedBehaviorSanitizer</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Coverage &amp; Records</h4>
          <ul>
            <li> 92.8% line coverage on C</li>
            <li> 89% on Python</li>
            <li> 28-record validation report</li>
            <li> Characterization document with stated error budgets and explicit limits</li>
          </ul>
        </div>
      </div>
    </div>
    <p>
      The C suites compile the actual firmware sources rather than a reimplementation, so a host test failing means
      the firmware is wrong and not that a stand-in drifted from it.
    </p>

    {/* ────────────── Stated Limits ────────────── */}
    <h2>Stated Limits</h2>
    <p>
      The characterization document lists what is not established as carefully as what is. These are the limits as
      written, not caveats added afterwards:
    </p>

    <div className="overflow-x-auto my-8">
      <table className="text-sm w-full">
        <thead>
          <tr>
            <th>Area</th>
            <th>What Is Not Established</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Analog accuracy</td>
            <td>Absolute amplitude accuracy, distortion and bandwidth are uncharacterized.</td>
            <td>Loopback alone cannot isolate which path contributes an error, and PA4 is loaded by the board&apos;s audio codec connection.</td>
          </tr>
          <tr>
            <td>Time-base accuracy</td>
            <td>Independent time-base accuracy is unmeasured.</td>
            <td>Every rate divides one crystal, so a frequency error is invisible from inside the device.</td>
          </tr>
          <tr>
            <td>Short pulses</td>
            <td>Asynchronous pulse limits are uncharacterized; a short pulse can be missed without a DMA error.</td>
            <td>GPIO reads land when DMA wins the bus rather than exactly at the timer edge. The 10 MS/s setting is experimental.</td>
          </tr>
          <tr>
            <td>Protocol decoding</td>
            <td>Decoder checks used generated patterns, not independent external devices.</td>
            <td>UART, SPI and I2C decoding was exercised against the instrument&apos;s own outputs.</td>
          </tr>
          <tr>
            <td>Skew reference</td>
            <td>Skew bounds the two acquisition paths against each other, not against an independent time base.</td>
            <td>It is measured against the device&apos;s own reference output, which shares the sampler&apos;s clock.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="text-sm text-gray-500">
      <em>
        Voltage and frequency figures are measured against the board&apos;s own references. They are not calibrated
        or certified against a traceable standard.
      </em>
    </p>

    {/* ────────────── Footer ────────────── */}
    <footer className="pt-12 border-t">
      <p className="text-sm text-gray-500">
        <em>
          Built with STM32 HAL and FreeRTOS in C, CMake and the Arm GNU Toolchain, and a Python desktop package
          with a PySide6 interface. Demonstrates multi-peripheral DMA coordination, hardware timer synchronization,
          binary protocol design, and measurement-driven validation. Source, validation report and characterization
          document at{' '}
          <a
            href="https://github.com/zgeez/stm32-mixed-signal-instrument"
            target="_blank"
            rel="noopener noreferrer"
          >
            the repository
          </a>, with the application and firmware on the{' '}
          <a
            href="https://github.com/zgeez/stm32-mixed-signal-instrument/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            releases page
          </a>.
        </em>
      </p>
    </footer>
  </article>
);

export default Stm32MixedSignalInstrumentContent;
