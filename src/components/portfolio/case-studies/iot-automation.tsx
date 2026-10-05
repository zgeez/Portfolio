import type { Project } from '@/data/projects';
import { asset } from '@/data/site';
import { CaseSection, OnThisPage, ProjectHeader } from '@/components/portfolio/project-header';
import { Bullets, Callout, DataTable, Figure, PhoneShot } from '@/components/portfolio/ui';

const img = (name: string) => asset(`assets/iot-automation/${name}`);

const METRICS = [
  { value: '<200 ms', label: 'command round trip', detail: 'reserved MQTT topics' },
  { value: '×3', label: 'battery life vs. baseline', detail: 'multi-mode deep sleep' },
  { value: '~80 ms', label: 'faster reconnect', detail: 'MQTT session in RTC memory' },
];

export function IotAutomationCaseStudy({ project }: { project: Project }) {
  return (
    <div className="space-y-14 md:space-y-20">
      <div className="space-y-8">
        <ProjectHeader project={project} metrics={METRICS} />
        <OnThisPage
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'architecture', label: 'Architecture' },
            { id: 'firmware', label: 'Firmware & power' },
            { id: 'app', label: 'Mobile app' },
            { id: 'debugging', label: 'Challenges' },
            { id: 'stack', label: 'Stack & next' },
          ]}
        />
      </div>

      <CaseSection id="overview" eyebrow="Overview" title="Retrofitting machines with cloud automation">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
          <div className="space-y-4 text-muted">
            <p>
              A modular, battery-friendly platform that retrofits legacy machinery with AWS-connected control: instant,
              scheduled, or sensor-driven automation from a Flutter mobile app.
            </p>
            <p>
              Drop-in ESP32 nodes (ESP-IDF) bolt onto existing industrial panels without disrupting production. Each node
              auto-registers with AWS IoT Core, streams telemetry, and executes Lambda-backed automation rules.
            </p>
            <Bullets
              items={[
                <><strong className="text-fg">Hot-swappable sensor decks:</strong> SPI/I²C mezzanines on a common backplane cut deployment from hours to minutes.</>,
                <><strong className="text-fg">Low-power firmware:</strong> multi-mode deep sleep with RTC wakeups and a brownout watchdog.</>,
                <><strong className="text-fg">Cloudless fallback:</strong> MQTT mesh gossip keeps local rules running during WAN outages.</>,
                <><strong className="text-fg">Companion app:</strong> real-time dashboards, OTA upgrades, and a drag-and-drop workflow builder.</>,
              ]}
            />
          </div>
          <Figure src={img('main.webp')} alt="ESP32 automation node mounted on an industrial machine control panel" width={1195} height={1143} caption="A node retrofitted onto an existing machine panel." />
        </div>
      </CaseSection>

      <CaseSection id="architecture" eyebrow="Device ↔ AWS ↔ app" title="Architecture">
        <Figure
          src={img('iot_diagram.jpeg')}
          alt="Architecture diagram: ESP32 nodes, AWS IoT Core, Lambda, DynamoDB and the Flutter app"
          width={1280}
          height={643}
          caption="ESP32 nodes ↔ AWS IoT Core ↔ Lambda ↔ DynamoDB ↔ Flutter app."
          imgClassName="bg-white"
        />
        <p className="mt-4 max-w-3xl text-muted">
          The serverless backend (Lambda + API Gateway) keeps state in DynamoDB, while time-critical commands travel on
          reserved MQTT topics for a sub-200 ms round trip.
        </p>
      </CaseSection>

      <CaseSection id="firmware" eyebrow="Implementation" title="Firmware & power management">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_14rem] md:items-start">
          <div className="space-y-4">
            <Bullets
              items={[
                'ESP-IDF on FreeRTOS, C/C++17',
                'Multi-mode deep sleep with RTC wakeups extends battery life ×3 versus baseline',
                'Brownout watchdog',
                'MQTT session parameters cached in RTC fast memory, trimming reconnect by about 80 ms',
                'Board-level EEPROM metadata auto-tunes bus timing for hot-swapped daughter cards',
              ]}
            />
            <Callout title="Power modes">
              The app exposes three modes per device: Real-Time (fastest response, highest consumption), Power Saving
              (balanced), and Super Power Saving (lowest consumption, slower response).
            </Callout>
          </div>
          <div className="flex justify-center">
            <PhoneShot src={img('power_modes.jpg')} alt="App power-mode screen with Real-Time, Power Saving and Super Power Saving options" caption="Per-device power mode" width={1080} height={2400} />
          </div>
        </div>
      </CaseSection>

      <CaseSection id="app" eyebrow="Mobile app" title="Flutter companion">
        <p className="mb-6 max-w-3xl text-muted">
          A reactive UI built with Riverpod streams live telemetry over MQTT and lets users compose automation chains
          visually. Devices are provisioned with ESP SmartConfig.
        </p>
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-3">
          <PhoneShot src={img('devices.jpg')} alt="App device list showing a node by MAC address" caption="Devices" width={1080} height={2400} />
          <PhoneShot src={img('automations.jpg')} alt="App automations screen" caption="Automations" width={1080} height={2262} />
          <PhoneShot src={img('execution.jpg')} alt="App workflow execution screen" caption="Execution" width={1080} height={2272} />
        </div>
      </CaseSection>

      <CaseSection id="debugging" eyebrow="Challenges" title="Problems and fixes">
        <DataTable
          head={['Challenge', 'Fix']}
          rows={[
            ['Stable SPI and I²C timing across hot-swapped daughter cards', 'Board-level EEPROM metadata to auto-tune bus timing'],
            ['TLS handshake overhead vs. aggressive deep-sleep budgets', 'MQTT session parameters cached in RTC fast memory, reconnect ~80 ms faster'],
            ['Cold-start Lambda latency on telemetry write spikes', 'DynamoDB on-demand mode with adaptive capacity and partition-key sharding'],
          ]}
        />
      </CaseSection>

      <CaseSection id="stack" eyebrow="Stack & next" title="Built with">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Firmware', 'ESP-IDF · FreeRTOS · C/C++17'],
            ['Cloud', 'AWS IoT Core · Lambda (Node.js) · API Gateway · DynamoDB · S3'],
            ['Mobile', 'Flutter · Riverpod · ESP SmartConfig'],
          ].map(([k, v]) => (
            <section key={k} className="panel p-5">
              <p className="label">{k}</p>
              <p className="mt-2 text-sm text-muted">{v}</p>
            </section>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-muted">
          Next: Matter-over-Thread compatibility, and moving critical edge-compute onto the ESP32’s dual-core RTOS to
          reduce cloud dependency.
        </p>
      </CaseSection>
    </div>
  );
}
