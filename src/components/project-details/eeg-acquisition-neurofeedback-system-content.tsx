import Image from 'next/image';
import React from 'react';

const EegAcquisitionNeurofeedbackSystemContent: React.FC = () => (
  <article className="container mx-auto px-4 py-0 prose lg:prose-lg">
    {/* ────────────── Header ────────────── */}
    <header className="mb-10">
      <p className="text-gray-600">
        An 8-channel EEG acquisition and neurofeedback prototype built around the TI ADS1299 analog front end
        and an ESP32-S3 SPI bridge, with a MATLAB acquisition/processing pipeline and a supervised
        Rest-vs-Task Random Forest classifier that reaches <strong>83% block-classification accuracy</strong> on
        focus-state recordings.
      </p>
      <p className="text-sm text-gray-500">
        Senior Design II · Team NeuroFocus · New York Institute of Technology<br />
        <em>My role: software lead, covering the MATLAB acquisition &amp; processing pipeline, ESP32-S3/ADS1299
        firmware bring-up, model training workflow, and dashboard integration.</em>
      </p>
      <p>
        <a
          href="https://zgeez.github.io/EEG-Based-Neurofeedback-System/"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the full project site →
        </a>
      </p>
    </header>

    {/* ────────────── Hero Image ────────────── */}
    <figure className="mb-12 flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/bench_setup.jpg`}
        alt="EEG bench setup with ADS1299EEG-FE front end, MMB0 motherboard, ESP32-S3 on a breadboard, and electrode leads"
        width={600}
        height={800}
        className="rounded-xl shadow-lg"
        priority
      />
      <figcaption className="text-center text-sm mt-2">
        Bench setup: ADS1299EEG-FE front end, MMB0 motherboard, ESP32-S3 SPI bridge, and electrode leads
      </figcaption>
    </figure>

    {/* ────────────── Project Overview ────────────── */}
    <h2>Project Overview</h2>
    <p>
      Sustained engagement is hard to measure in a classroom: the usual feedback is delayed, observational, and
      non-adaptive. This project asked a narrower engineering question: <strong>can a locally-processed,
      low-cost 8-channel EEG rig reliably separate rest from cognitive task?</strong> Answering it meant building
      the entire chain: analog front end, embedded firmware, acquisition software, labeled data collection,
      a supervised model, and a teacher-facing display.
    </p>
    <p className="text-sm text-gray-500">
      <em>
        This is an engineering proof-of-concept. It does not diagnose or treat any condition, and its output is a
        Rest-vs-Task classification result used as a cautious proxy for task engagement, not a measure of
        attention or ability.
      </em>
    </p>

    {/* ────────────── Headline Results ────────────── */}
    <div className="bg-green-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4 text-green-800">Headline Results</h3>
      <div className="grid md:grid-cols-4 gap-4 text-center">
        <div>
          <h4 className="text-2xl font-bold text-green-700">82.9%</h4>
          <p className="text-sm text-green-600">Block Accuracy<br/>Rest vs. Task</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">8 ch</h4>
          <p className="text-sm text-green-600">Montage<br/>Frontal · Central · Parietal</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">250 Hz</h4>
          <p className="text-sm text-green-600">Sampling Rate<br/>24-bit Packets</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">33</h4>
          <p className="text-sm text-green-600">Labeled Runs<br/>4 Task Paradigms</p>
        </div>
      </div>
    </div>

    {/* ────────────── Signal Chain ────────────── */}
    <h2>Signal Chain</h2>
    <p>
      Every stage runs locally, so there is no cloud dependency in the demo workflow, which keeps sensitive EEG and
      session data on the machine that recorded it.
    </p>
    <div className="bg-gray-50 p-6 rounded-lg my-8">
      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">1 · Acquire</h4>
          <ul>
            <li> 8 scalp electrodes (10–20 sites)</li>
            <li> ADS1299 24-bit front end</li>
            <li> Fpz bias, TP8 reference</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">2 · Stream</h4>
          <ul>
            <li> ESP32-S3 SPI master</li>
            <li> DRDY-driven frame reads</li>
            <li> Binary packets over USB serial</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">3 · Process</h4>
          <ul>
            <li> MATLAB packet parsing</li>
            <li> Filtering + Welch PSD</li>
            <li> Artifact gating, CSV logging</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">4 · Classify &amp; Display</h4>
          <ul>
            <li> Random Forest → P(Task)</li>
            <li> Thresholded Rest/Task state</li>
            <li> Teacher &amp; student views</li>
          </ul>
        </div>
      </div>
    </div>

    {/* ────────────── Hardware ────────────── */}
    <h2>Hardware &amp; Firmware</h2>
    <p>
      The analog front end is the <strong>TI ADS1299EEG-FE</strong>, an eight-channel, 24-bit simultaneous-sampling
      biopotential ADC with integrated PGAs and a bias-drive amplifier. Rather than use the stock DSP motherboard
      path, I brought the board up against an <strong>ESP32-S3</strong> acting as SPI master: the MCU configures the
      channel registers, starts continuous conversion, reads each 27-byte frame on the <code>DRDY</code> interrupt,
      and forwards framed binary packets over USB serial at 250 Hz.
    </p>

    <div className="grid md:grid-cols-2 gap-6 my-8">
      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/ads1299_stack.jpg`}
          alt="ADS1299EEG-FE front-end board mated to the TI MMB0 modular EVM motherboard"
          width={800}
          height={600}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-sm text-center mt-2">
          ADS1299EEG-FE mated to the MMB0 motherboard, with the SPI header broken out
        </figcaption>
      </figure>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/ads1299_frontend.jpg`}
          alt="Close-up of the ADS1299 analog front end showing the per-channel input headers and bias/reference pins"
          width={800}
          height={600}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-sm text-center mt-2">
          Per-channel differential input headers plus BIAS and REF connections
        </figcaption>
      </figure>
    </div>

    <div className="bg-blue-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4 text-blue-800">Firmware Responsibilities</h3>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">SPI Bring-Up</h4>
          <ul>
            <li> Register configuration for all 8 channels</li>
            <li> Gain, reference buffer, and bias-drive setup</li>
            <li> <code>RDATAC</code> continuous-read mode</li>
            <li> Clock/timing validation with logic analysis</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Streaming</h4>
          <ul>
            <li> DRDY-triggered frame capture</li>
            <li> Status word + 8 × 24-bit signed samples</li>
            <li> Framed binary packets over USB serial</li>
            <li> Drop counting for stream integrity</li>
          </ul>
        </div>
      </div>
    </div>

    {/* ────────────── Electrode Montage ────────────── */}
    <h2>Electrode Montage</h2>
    <p>
      The prototype started as a single-channel setup with very limited spatial coverage. The final montage moved
      to eight channels spanning frontal, central, and parietal sites, enough coverage to separate executive-task
      activity from rest without making setup impractical for repeated testing sessions.
    </p>

    <div className="grid md:grid-cols-2 gap-8 my-8 items-start">
      <div className="overflow-x-auto">
        <table className="text-sm w-full">
          <thead>
            <tr>
              <th>Channel / Role</th>
              <th>Lead Color</th>
              <th>Site</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Bias</td><td>Bias lead</td><td>Fpz</td></tr>
            <tr><td>Reference</td><td>Reference lead</td><td>TP8</td></tr>
            <tr><td>CH1</td><td>Red</td><td>F3</td></tr>
            <tr><td>CH2</td><td>Green</td><td>Fz</td></tr>
            <tr><td>CH3</td><td>Brown</td><td>F4</td></tr>
            <tr><td>CH4</td><td>Blue</td><td>C3</td></tr>
            <tr><td>CH5</td><td>Magenta</td><td>Cz</td></tr>
            <tr><td>CH6</td><td>Yellow</td><td>C4</td></tr>
            <tr><td>CH7</td><td>Orange</td><td>P3</td></tr>
            <tr><td>CH8</td><td>Gray</td><td>P4</td></tr>
          </tbody>
        </table>
      </div>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/electrode_setup.jpg`}
          alt="Final 8-channel EEG electrode cap setup on a participant"
          width={700}
          height={933}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-sm text-center mt-2">Final 8-channel head setup used for recording</figcaption>
      </figure>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg my-8">
      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Frontal</h4>
          <p>F3 / Fz / F4: frontal and executive-task-related activity.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Central</h4>
          <p>C3 / Cz / C4: central and sensorimotor rhythm activity.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Parietal</h4>
          <p>P3 / P4: parietal task-state information for the classifier.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Bias &amp; Reference</h4>
          <p>Fpz drives bias to reduce common-mode noise; TP8 references away from measurement sites.</p>
        </div>
      </div>
    </div>

    {/* ────────────── MATLAB Pipeline ────────────── */}
    <h2>MATLAB Acquisition &amp; Processing</h2>
    <p>
      MATLAB is the core of the workflow: it opens the serial port, parses the binary ADS1299 packets, converts raw
      counts to microvolts, applies the real-time filter chain, computes spectral features, launches the cognitive
      tasks, writes synchronized markers, and logs every run to disk in a reproducible folder structure.
    </p>

    <figure className="mb-8 flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/matlab_ui.png`}
        alt="MATLAB acquisition interface showing raw EEG, filtered channels, Welch PSD, and model focus index"
        width={1000}
        height={625}
        className="rounded-lg shadow-lg w-full max-w-4xl"
      />
      <figcaption className="text-center text-sm mt-2">
        Live acquisition UI: raw EEG, filtered stack (HP 0.2 → 59–61 Hz notch → BP 1–50), Welch PSD, and model
        focus index, with a mental-math task prompt running alongside
      </figcaption>
    </figure>

    <div className="grid md:grid-cols-2 gap-6 my-8">
      <section className="bg-purple-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-purple-800">🔹 Acquisition</h3>
        <ul className="text-sm">
          <li> Binary ADS1299 packet parsing over serial</li>
          <li> 250 Hz sampling, 24-bit signed channel values</li>
          <li> Counts converted to microvolts</li>
          <li> Drop counting and stream health readout</li>
        </ul>
      </section>

      <section className="bg-orange-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-orange-800">🔹 Signal Processing</h3>
        <ul className="text-sm">
          <li> High-pass, mains notch, and band-pass chain</li>
          <li> Welch power spectral density per channel</li>
          <li> Delta / theta / alpha / beta bandpower extraction</li>
          <li> Artifact gating for blink and motion transients</li>
        </ul>
      </section>

      <section className="bg-blue-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-blue-800">🔹 Visualization</h3>
        <ul className="text-sm">
          <li> Side-by-side raw and filtered channel views</li>
          <li> Single or stacked channel display modes</li>
          <li> Live PSD plot with selectable channel</li>
          <li> Rolling focus-index trace from model output</li>
        </ul>
      </section>

      <section className="bg-red-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-red-800">🔹 Logging &amp; Tasks</h3>
        <ul className="text-sm">
          <li> Per-run CSV logging under <code>logs/runs/</code></li>
          <li> Synchronized task markers for supervised labels</li>
          <li> Task launcher: mental math, Stroop, Go/NoGo, task-switching</li>
          <li> Per-run setup metadata for reproducibility</li>
        </ul>
      </section>
    </div>

    {/* ────────────── Data Collection ────────────── */}
    <h2>Data Collection</h2>
    <p>
      Supervised training needed clean labels, so every recording is structured as alternating rest and task blocks
      with markers written by the task launcher itself, where Rest = 0 and Task = 1. Marker alignment turned out to be one of
      the highest-leverage details in the whole project: misaligned blocks silently poison the training set.
    </p>

    <div className="bg-gray-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4">Recorded Dataset</h3>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Run Organization</h4>
          <ul>
            <li> 45 run folders under <code>logs/runs</code></li>
            <li> 33 completed runs with task result CSVs</li>
            <li> Per-run setup metadata alongside raw data</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Completed 8-Channel Runs</h4>
          <ul>
            <li> 10 × mental math</li>
            <li> 6 × Stroop</li>
            <li> 6 × Go/NoGo</li>
            <li> 6 × task-switching</li>
          </ul>
        </div>
      </div>
    </div>

    {/* ────────────── Model ────────────── */}
    <h2>Rest-vs-Task Classifier</h2>
    <p>
      The classifier is a <strong>Random Forest</strong> over spectral features from 5-second windows with a
      2.5-second step. Each window contributes Welch-PSD-derived bandpower features across all eight channels;
      artifact and outlier rejection runs before inference. The model outputs <code>P(Task)</code>, and a tuned
      threshold converts that probability into a Rest-vs-Task decision. Block accuracy, the metric that matters for
      this use case, aggregates window-level predictions across a full task or rest block.
    </p>

    <div className="overflow-x-auto my-8">
      <table className="text-sm w-full">
        <thead>
          <tr>
            <th>Model</th>
            <th>Task(s)</th>
            <th>Runs</th>
            <th>Threshold</th>
            <th>Segment Acc.</th>
            <th>Block Acc.</th>
            <th>Generalization</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Initial</td>
            <td>Mental math</td>
            <td>5</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>70.0%</td>
            <td>55.5</td>
          </tr>
          <tr>
            <td><strong>Best mental-math</strong></td>
            <td>Mental math</td>
            <td>10</td>
            <td>0.440</td>
            <td>80.13%</td>
            <td><strong>82.9%</strong></td>
            <td>78.2</td>
          </tr>
          <tr>
            <td>Broad multi-task</td>
            <td>All four paradigms</td>
            <td>28</td>
            <td>0.530</td>
            <td>76.47%</td>
            <td>79.4%</td>
            <td>70.1</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="grid md:grid-cols-2 gap-6 my-8">
      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/model_initial.png`}
          alt="Evaluation plots for the initial 8-channel mental-math model"
          width={700}
          height={500}
          className="rounded-lg w-full"
        />
        <figcaption className="text-sm text-center mt-2">Initial model: 5 runs, 70.0% block accuracy</figcaption>
      </figure>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/model_latest.png`}
          alt="Evaluation plots for the strongest 8-channel mental-math model"
          width={700}
          height={500}
          className="rounded-lg w-full"
        />
        <figcaption className="text-sm text-center mt-2">Best model: 10 runs, 82.9% block accuracy</figcaption>
      </figure>
    </div>

    <div className="bg-green-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4 text-green-800">What Moved the Needle</h3>
      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div>
          <h4 className="text-2xl font-bold text-green-700">5 → 10</h4>
          <p className="text-sm text-green-600">Training Runs</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">70.0% → 82.9%</h4>
          <p className="text-sm text-green-600">Block Accuracy</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-green-700">55.5 → 78.2</h4>
          <p className="text-sm text-green-600">Generalization Score</p>
        </div>
      </div>
      <p className="text-sm mt-4 mb-0 text-green-900">
        The gain came from complete 8-channel recordings and stricter marker/artifact hygiene rather than from model
        complexity. The broad multi-task model scores slightly lower but covers all four paradigms, making it the
        more general of the two.
      </p>
    </div>

    {/* ────────────── Dashboard ────────────── */}
    <h2>Teacher Dashboard &amp; Student View</h2>
    <p>
      The Electron/React dashboard is the instructor side of the prototype. It separates system controls from what a
      student sees: the teacher gets device state, engagement-proxy history, calibration, and session scripting, while
      the student view shows only the current classroom prompt.
    </p>

    <div className="grid md:grid-cols-2 gap-6 my-8">
      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/teacher_view.png`}
          alt="Teacher dashboard with device cards, engagement-proxy history, and session controls"
          width={800}
          height={478}
          className="rounded-lg w-full"
        />
        <figcaption className="text-sm text-center mt-2">Teacher dashboard: live, mock, and replay modes</figcaption>
      </figure>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/student_view.png`}
          alt="Student-facing session view showing a classroom task prompt"
          width={800}
          height={422}
          className="rounded-lg w-full"
        />
        <figcaption className="text-sm text-center mt-2">Student view: task prompts only, no teacher controls</figcaption>
      </figure>
    </div>

    <div className="bg-purple-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4 text-purple-800">Dashboard Capabilities</h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Session Modes</h4>
          <ul>
            <li> Live serial connection</li>
            <li> Mock mode for demos</li>
            <li> Replay of recorded runs</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Monitoring</h4>
          <ul>
            <li> Per-device status cards</li>
            <li> Engagement-proxy history</li>
            <li> Hardware validation checks</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Control</h4>
          <ul>
            <li> Calibration and scripted session context</li>
            <li> Student display controls</li>
            <li> Master audio control and CSV export</li>
          </ul>
        </div>
      </div>
    </div>

    <figure className="mb-8 flex flex-col items-center">
      <video
        controls
        preload="metadata"
        poster={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/teacher_view.png`}
        className="rounded-lg shadow-lg w-full max-w-4xl"
      >
        <source
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/eeg-neurofeedback/teacher-dashboard-demo.mp4`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <figcaption className="text-center text-sm mt-2">
        Teacher dashboard demonstration: session controls and engagement-proxy display
      </figcaption>
    </figure>

    {/* ────────────── Engineering Challenges ────────────── */}
    <h2>Engineering Challenges</h2>
    <div className="overflow-x-auto my-8">
      <table className="text-sm w-full">
        <thead>
          <tr>
            <th>Issue</th>
            <th>What Went Wrong</th>
            <th>Fix</th>
            <th>Remaining Limitation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Electrode contact</td>
            <td>Signal quality varied as contact shifted during setup or movement.</td>
            <td>Tightened the setup procedure and added a pre-test signal check.</td>
            <td>Still sensitive to motion and contact changes.</td>
          </tr>
          <tr>
            <td>SPI / ADS1299 bring-up</td>
            <td>The data path needed exact timing and packet validation to produce valid frames.</td>
            <td>Validated packet structure on the serial link and with logic-analyzer-style debugging.</td>
            <td>The hardware path remains complex to reproduce.</td>
          </tr>
          <tr>
            <td>Marker alignment</td>
            <td>Misaligned task markers quietly degrade supervised label quality.</td>
            <td>Wrote markers from the task launcher and aligned them to the sample stream.</td>
            <td>Bad markers can still corrupt a training set.</td>
          </tr>
          <tr>
            <td>Blink &amp; motion artifacts</td>
            <td>Transients can dominate a short EEG window and swamp real features.</td>
            <td>Added artifact rejection and gating before feature extraction.</td>
            <td>Not fully artifact-proof.</td>
          </tr>
          <tr>
            <td>Live vs. offline preprocessing</td>
            <td>Training and live inference paths can diverge if filtering differs.</td>
            <td>Documented and narrowed the mismatch between the two paths.</td>
            <td>Full live inference integration is still outstanding.</td>
          </tr>
          <tr>
            <td>Early single-channel setup</td>
            <td>The initial configuration gave too little spatial coverage to separate states.</td>
            <td>Moved to the final 8-channel montage.</td>
            <td>Setup takes noticeably longer than the early rig.</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* ────────────── Privacy & Ethics ────────────── */}
    <h2>Privacy, Safety &amp; Scope</h2>
    <div className="bg-yellow-50 p-6 rounded-lg my-8">
      <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-900">
        <div>
          <h4 className="font-semibold mb-2">Local-First Processing</h4>
          <p>
            Acquisition, markers, inference, and display all run locally. No cloud processing is required for the core
            workflow, which limits exposure of sensitive EEG and session data.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">No Diagnostic Claims</h4>
          <p>
            The system does not diagnose or treat ADHD or any other condition. Its output is an engineering
            classification result, not a medical conclusion.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Data Minimization</h4>
          <p>
            Only the data needed for testing, training, and validation is retained, using anonymous subject and
            session labels.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Supervised Use Only</h4>
          <p>
            The prototype is used under supervision within senior-design constraints. Any classroom or child-facing
            deployment would require consent procedures and institutional review.
          </p>
        </div>
      </div>
    </div>

    {/* ────────────── Future Work ────────────── */}
    <h2>Future Work</h2>
    <ul>
      <li><strong>Broader dataset:</strong> collect across more subjects to test cross-subject generalization</li>
      <li><strong>Live inference:</strong> integrate the latest exported model directly into the dashboard path</li>
      <li><strong>Artifact handling:</strong> stronger rejection for blink and motion transients</li>
      <li><strong>Setup ergonomics:</strong> improve cap comfort and reduce time-to-first-signal</li>
      <li><strong>Validation:</strong> supervised, IRB-style usability testing before any real classroom use</li>
    </ul>

    {/* ────────────── Footer ────────────── */}
    <footer className="pt-12 border-t">
      <p className="text-sm text-gray-500">
        <em>
          Built with the TI ADS1299 analog front end, ESP32-S3 firmware, MATLAB, and an Electron/React dashboard.
          Demonstrates biopotential acquisition, embedded SPI interfacing, biomedical signal processing, and applied
          machine learning. Full write-up, references, and team credits at{' '}
          <a
            href="https://zgeez.github.io/EEG-Based-Neurofeedback-System/"
            target="_blank"
            rel="noopener noreferrer"
          >
            the project site
          </a>.
        </em>
      </p>
    </footer>
  </article>
);

export default EegAcquisitionNeurofeedbackSystemContent;
