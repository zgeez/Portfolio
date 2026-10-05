import type { Project } from '@/data/projects';
import { waypointHeroMetrics, waypointLayers } from '@/data/waypoint';
import { AbstractionLens } from '@/components/portfolio/abstraction/abstraction-lens';
import { CaseSection, OnThisPage, ProjectHeader } from '@/components/portfolio/project-header';
import { Callout, DebugSteps } from '@/components/portfolio/ui';
import {
  WaypointFirmwareLayer,
  WaypointNavigationLayer,
  WaypointProductLayer,
  WaypointProtocolLayer,
  WaypointSystemLayer,
} from './waypoint-layers';

export function WaypointCaseStudy({ project }: { project: Project }) {
  return (
    <div className="space-y-14 md:space-y-20">
      <div className="space-y-8">
        <ProjectHeader project={project} metrics={waypointHeroMetrics} />
        <OnThisPage
          items={[
            { id: 'layers', label: 'Product → Protocol' },
            { id: 'debugging', label: 'Debugging' },
            { id: 'built-with', label: 'Built with' },
          ]}
        />
      </div>

      <section id="layers" aria-labelledby="layers-title" className="scroll-mt-24">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Abstraction lens</p>
          <h2 id="layers-title" className="section-title mt-2">
            From a glance to the wire
          </h2>
          <p className="mt-3 text-muted">Five layers, from what the ring tells you down to the bytes over BLE.</p>
        </div>
        <AbstractionLens
          layers={waypointLayers}
          panels={[
            <WaypointProductLayer key="product" />,
            <WaypointSystemLayer key="system" />,
            <WaypointFirmwareLayer key="firmware" />,
            <WaypointNavigationLayer key="navigation" />,
            <WaypointProtocolLayer key="protocol" />,
          ]}
        />
      </section>

      <CaseSection id="debugging" eyebrow="Debugging" title="Bugs the tests caught">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="panel p-5">
            <p className="label mb-4">The destination that moved the device</p>
            <DebugSteps
              steps={[
                { stage: 'Symptom', text: 'After sending a destination, the device’s location on the map briefly jumped to the destination itself.' },
                {
                  stage: 'Root cause',
                  text: (
                    <>
                      The destination echo <code className="font-mono text-accent-strong">OK SET lat=… lon=…</code> matched the
                      app’s position pattern.
                    </>
                  ),
                },
                { stage: 'Caught by', text: 'App unit tests that feed real firmware lines through the parser. The same harness renders the app screenshots on this page.' },
              ]}
            />
          </article>
          <article className="panel p-5">
            <p className="label mb-4">The pointer that jumps at north</p>
            <DebugSteps
              steps={[
                { stage: 'Risk', text: 'Quantizing bearing − heading directly makes the pointer leap across the ring as heading crosses 0°/360°.' },
                { stage: 'Fix', text: 'Take the shortest signed turn, −180° to 180°, before quantizing to 22.5° pixels.' },
                { stage: 'Result', text: 'No jump at north. Drag the heading through 0° in the Sensor / nav layer to see it.' },
              ]}
            />
          </article>
        </div>
      </CaseSection>

      <CaseSection id="built-with" eyebrow="Built with" title="Stack">
        <Callout tone="accent">
          PlatformIO on the Arduino-ESP32 framework using NimBLE-Arduino, TinyGPS++, Adafruit BNO08x and Adafruit NeoPixel,
          with a Flutter companion app using flutter_reactive_ble and Google Maps. Demonstrates sensor fusion, BLE GATT
          protocol design, state-driven embedded UI, non-volatile configuration, and cross-platform mobile integration.
        </Callout>
      </CaseSection>
    </div>
  );
}
