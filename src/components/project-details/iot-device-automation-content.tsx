import Image from 'next/image';
import React from 'react';

/**
 * IoT Device Automation System — Project Page
 * ------------------------------------------------------------
 * This page mirrors the clean, editorial style of raphaelchang.com,
 * combining a concise narrative with large visuals and pull‑quotes.
 * Replace every `assets/...` path with your actual assets once ready.
 */
const IotDeviceAutomationContent: React.FC = () => (
  <article className="container mx-auto px-4 py-12 prose lg:prose-lg">
    {/* ────────────── Header ────────────── */}
    <header className="mb-14 text-center">
      <p className="text-gray-600 max-w-2xl mx-auto">
        A modular, battery‑friendly platform that retrofits legacy machinery with
        AWS‑connected intelligence—delivering instant, scheduled, or sensor‑driven
        automation through a Flutter mobile app.
      </p>
    </header>

    {/* ────────────── Hero / Demo GIF ────────────── */}
    {/* <figure className="mb-16 rounded-2xl overflow-hidden shadow-lg">
      <Image
        src="assets/iot-automation/hero-demo.gif" // TODO: replace
        alt="Time‑lapse demo of an appliance toggling via the mobile app"
        width={1280}
        height={720}
        priority
        className="w-full h-auto"
      />
      <figcaption className="text-center text-sm text-gray-500 mt-2">
        Live demo showcasing sub‑second cloud round‑trip latency.
      </figcaption>
    </figure> */}

    {/* ────────────── Executive Overview ────────────── */}
    <section className="mb-16">
      <h2>Overview</h2>
      <p>
        The project delivers drop‑in IoT nodes based on ESP32 (ESP‑IDF) that bolt
        onto existing industrial panels without disrupting production. Each node
        auto‑registers with AWS IoT Core, streams telemetry, and executes
        Lambda‑backed automation rules.
      </p>
    </section>

    {/* ────────────── Key Capabilities ────────────── */}
    <section className="mb-16">
      <h2>Key Capabilities</h2>
      <ul>
        <li>
          <strong>Hot‑swappable sensor decks:</strong> SPI/I²C mezzanines slot into a
          common backplane, cutting deployment time from hours to minutes.
        </li>
        <li>
          <strong>Ultra‑low power firmware:</strong> Multi‑mode deep sleep with RTC
          wakeups and Brownout watchdog extends battery life ×3 versus baseline.
        </li>
        <li>
          <strong>Cloudless fallback:</strong> MQTT‑mesh gossip maintains local rules
          during WAN outages.
        </li>
        <li>
          <strong>Flutter companion app:</strong> Real‑time dashboards, on‑device OTA
          upgrades, and drag‑and‑drop workflow builder.
        </li>
      </ul>
    </section>

    {/* ────────────── System Architecture ────────────── */}
    <section className="mb-16">
      <h2>System Architecture</h2>
      <div className="my-8 rounded-2xl overflow-hidden shadow-md">
        <Image
          src="assets/iot-automation/iot_diagram.jpeg"
          alt="High‑level architecture diagram: ESP32 nodes ↔ AWS IoT Core ↔ Lambda ↔ DynamoDB ↔ Flutter app"
          width={1024}
          height={640}
          className="w-full h-auto"
        />
      </div>
      <p>
        The serverless backend (Lambda + API Gateway) offloads stateful logic to
        DynamoDB, while time‑critical commands travel via reserved MQTT topics
        for &lt;200 ms round‑trip.
      </p>
    </section>

    {/* ────────────── Mobile Experience ────────────── */}
    <section className="mb-16">
      <h2>Mobile Experience</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <Image
          src="assets/iot-automation/automations.jpg"
          alt="Flutter app — real‑time dashboard"
          width={600}
          height={1200}
          className="rounded-xl shadow-md"
        />
        <Image
          src="assets/iot-automation/execution.jpg"
          alt="Flutter app — workflow builder screen"
          width={600}
          height={1200}
          className="rounded-xl shadow-md"
        />
      </div>
      <p className="mt-4">
        A reactive UI built with Riverpod streams live telemetry over MQTT and
        lets users compose automation chains visually—mirroring Node-RED’s UX
        but tuned for mobile ergonomics.
      </p>
    </section>

    {/* ────────────── Hardware Gallery ──────────────
    <section className="mb-16">
      <h2>Hardware Gallery</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          'assets/iot-automation/pcb-front.jpg',
          'assets/iot-automation/pcb-back.jpg',
          'assets/iot-automation/enclosure-exploded.png',
        ].map((src) => (
          <Image
            key={src}
            src={src} // TODO
            alt="PCB or enclosure render"
            width={400}
            height={300}
            className="rounded-lg shadow-md object-cover"
          />
        ))}
      </div>
    </section> */}

    {/* ────────────── Critical Reflection ────────────── */}
    <section className="mb-16">
      <h2>Critical Reflection</h2>
      <h3 className="mt-6">Challenges</h3>
      <ul>
        <li>Negotiating stable SPI & I²C timing across hot‑swapped daughter‑cards.</li>
        <li>Balancing TLS handshake overhead with aggressive deep‑sleep budgets.</li>
        <li>Mitigating cold‑start Lambda latency on telemetry write spikes.</li>
      </ul>
      <h3 className="mt-6">Solutions &amp; Lessons</h3>
      <ul>
        <li>Implemented board‑level EEPROM meta‑data to auto‑tune bus timing.</li>
        <li>Cached MQTT session params in RTC fast‑mem, trimming reconnect approximately 80 ms.</li>
        <li>Switched DynamoDB tables to <em>On‑Demand</em> mode with adaptive capacity and partition‑key
         sharding.</li>
      </ul>
      <h3 className="mt-6">Next Steps</h3>
      <p>
        Exploring Matter‑over‑Thread compatibility and moving critical
        edge‑compute pieces onto the ESP’s dual‑core RTOS to reduce cloud
        dependency.
      </p>
    </section>

    {/* ────────────── Tech Stack ────────────── */}
    <section className="mb-16">
      <h2>Tech Stack</h2>
      <ul>
        <li><strong>Firmware:</strong> ESP‑IDF | FreeRTOS | C/C++17</li>
        <li><strong>Cloud:</strong> AWS IoT Core | Lambda (Node.js) | API Gateway | DynamoDB | S3 | CodePipeline</li>
        <li><strong>Mobile:</strong> Flutter | Riverpod | AWS Amplify</li>
      </ul>
    </section>


  </article>
);

export default IotDeviceAutomationContent;
