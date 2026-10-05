import Image from 'next/image';
import { asset } from '@/data/site';
import { waypointCommands, waypointSystemDiagram, waypointTelemetry, waypointTestEnvs } from '@/data/waypoint';
import { ProbeDiagram } from '@/components/portfolio/abstraction/probe-diagram';
import { Bullets, Callout, DataTable, Figure } from '@/components/portfolio/ui';
import { HeadingToPixel, RingStateExplorer } from './ring-explorer';

const img = (name: string) => asset(`assets/waypoint-compass/${name}`);

export function WaypointProductLayer() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="space-y-4 text-muted">
          <p className="text-lg leading-relaxed text-fg">A direction you can read at a glance, from a device that keeps working if the phone goes away.</p>
          <p>
            Turn-by-turn navigation assumes roads and a screen you are willing to stare at. For a short walk to a pinned
            spot (a meeting point, a campsite, a parked car) all you need is the direction and whether you are getting
            closer.
          </p>
          <p>
            One red pixel marks the way the device is facing, and a cyan pointer marks the way to the destination. Line
            the two up and walk. A Flutter companion app sends destinations over Bluetooth Low Energy and shows live
            telemetry, but once a destination is stored the device navigates on its own.
          </p>
        </div>
        <Figure
          src={img('app_and_ring.jpg')}
          alt="At night, a phone running the companion app connected to XIAO-GPS shows latitude 40.620667, longitude −74.030255, HDOP 1.1 with 8 satellites and a bearing of 214.9 degrees south-west at 0.012 km; beside it the compass ring shows a red forward pixel flanked by two blue pixels"
          width={1800}
          height={1244}
          priority
          caption="Live session: the app reports 214.9° SW at 12 m, and the ring agrees. Blue trail pixels straddle the red forward pixel: the destination is dead ahead."
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Figure src={img('enclosure_ring.jpg')} alt="White 3D-printed enclosure with the ring: forward pixel red at the top, a red target pixel between two trail pixels at the bottom" width={1400} height={1400} caption="Destination behind; target red while accuracy is flagged." />
        <Figure src={img('ring_turning.jpg')} alt="The ring in the dark: a red forward pixel and, well around the ring, a red target flanked by two blue trail pixels" width={1000} height={1000} caption="Off course: forward and target far apart." />
        <Figure src={img('ring_arrived.jpg')} alt="All sixteen ring pixels glowing solid green" width={1000} height={1000} caption="Arrived: solid green inside 2 m." />
      </div>
    </div>
  );
}

export function WaypointSystemLayer() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-muted">
        The main loop polls GPS, IMU and BLE without blocking, solves navigation, renders the ring and, once a second,
        publishes telemetry. Each module owns one peripheral and exposes a few plain functions, so the same navigation
        and ring code builds against real or simulated sensors.
      </p>
      <ProbeDiagram data={waypointSystemDiagram} />
    </div>
  );
}

export function WaypointFirmwareLayer() {
  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-muted">
        The ring is the whole interface, so every state had to be readable without a legend after one walk. The firmware
        renders a strict priority order, and the device never shows a direction it cannot justify.
      </p>
      <RingStateExplorer />
      <Callout tone="warning" title="Honest about uncertainty">
        A compass that points confidently in the wrong direction is worse than no compass. A fix is flagged as poor when{' '}
        <strong className="text-fg">HDOP exceeds 6, fewer than 4 satellites are used, or the fix is older than 2 s</strong>,
        and the heading is flagged when the BNO08x’s own accuracy estimate exceeds 0.35 rad (about 20°). Either condition
        turns the target pixel red and makes the forward pixel blink faster.
      </Callout>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="panel p-5">
          <p className="label">Heading failover</p>
          <Bullets
            className="mt-3"
            items={[
              'IMU heading preferred whenever valid',
              'GPS course-over-ground once moving',
              'Amber “need heading” state when neither exists',
              'Heading expires after 500 ms without IMU data',
            ]}
          />
        </section>
        <section className="panel p-5">
          <p className="label">IMU self-recovery</p>
          <Bullets
            className="mt-3"
            items={[
              'Probes both addresses, 0x4B then 0x4A',
              'Re-enables reports after a sensor reset',
              'Reinitializes after 1.5 s of stalled heading',
              '2 s retry backoff: a missing IMU never stalls the loop',
            ]}
          />
        </section>
        <section className="panel p-5">
          <p className="label">Survives a reboot</p>
          <Bullets
            className="mt-3"
            items={[
              <>Destination in the <code className="font-mono text-accent-strong">dest</code> NVS namespace</>,
              <>Mounting offset in the <code className="font-mono text-accent-strong">imu</code> namespace</>,
              'Restored at boot, before BLE advertising starts',
              'Power-cycle mid-walk and navigation resumes',
            ]}
          />
        </section>
      </div>
    </div>
  );
}

export function WaypointNavigationLayer() {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-muted">
        The BNO08x runs its own sensor fusion and reports an AR/VR-stabilized rotation vector: a quaternion with an
        accuracy estimate. The firmware extracts yaw, converts it from the sensor’s counter-clockwise-from-east
        convention to a compass heading clockwise from north, and applies a mounting offset so pixel 0 matches the
        physical front of the enclosure.
      </p>
      <pre className="panel overflow-x-auto p-4 font-mono text-xs leading-relaxed text-fg sm:text-sm">
        <code>{`// imu_module.cpp: quaternion → yaw → compass heading
yaw     = atan2(2(qw·qz + qx·qy), 1 − 2(qy² + qz²))
heading = normalize(90° − yaw + mountOffset)

// navigation → ring
delta   = wrap(bearing − heading)     // shortest turn, −180°..180°
pixel   = round(delta / 22.5°) mod 16 // relative to the forward pixel`}</code>
      </pre>
      <HeadingToPixel />
      <div className="grid gap-6 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:items-center">
        <Figure
          src={img('app_ring_turn.png')}
          alt="Ring mirror card reading 48 m, SW 214.9 degrees, with the cyan target pixel three positions clockwise of the red forward pixel and the instruction Turn 57 degrees right"
          width={1190}
          height={1191}
          caption="The real app, same case: heading 158°, bearing 214.9°, target three pixels clockwise, “Turn 57° right”."
        />
        <p className="text-sm text-muted">
          The companion app’s ring mirror re-implements the firmware’s rendering rules and was checked against them in
          unit tests, so the phone and the ring agree, and so does the demo above.
        </p>
      </div>
      <p className="max-w-3xl text-sm text-muted">
        Bearing and distance to the destination are the great-circle initial course and distance from the current fix,
        computed with TinyGPS++. Arrival is declared inside a 2 m radius.
      </p>
    </div>
  );
}

export function WaypointProtocolLayer() {
  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-muted">
        The device advertises as <code className="font-mono text-accent-strong">XIAO-GPS</code> and exposes the Nordic UART
        Service over NimBLE: one write characteristic for commands, one notify characteristic for replies and telemetry.
        Using NUS means any generic BLE terminal can drive the device. Commands are short text lines, validated on the
        device, and every reply is mirrored to USB serial for debugging.
      </p>
      <DataTable
        head={['Command', 'Effect', 'Reply']}
        rows={waypointCommands.map(([c, e, r]) => [
          <code key="c" className="whitespace-nowrap font-mono text-accent-strong">{c}</code>,
          e,
          <code key="r" className="font-mono text-xs">{r}</code>,
        ])}
      />
      <figure className="panel overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <p className="label">Telemetry · key=value</p>
          <span className="tag-recorded">Recorded lines</span>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-all p-4 font-mono text-xs leading-relaxed text-muted">{waypointTelemetry}</pre>
        <figcaption className="border-t border-line px-4 py-3 text-sm text-muted">
          Every optional field carries a matching <code className="font-mono text-accent-strong">_valid</code> flag and a{' '}
          <code className="font-mono text-accent-strong">?</code> placeholder, so the app never has to guess whether zero
          means zero or missing. Sequence numbers make dropped notifications visible.
        </figcaption>
      </figure>
      <Callout title="Two details that make the link dependable">
        A reply produced before the phone subscribes is held and <strong className="text-fg">flushed on subscription</strong>{' '}
        rather than lost, and a full status snapshot is sent the moment a client becomes ready, so a freshly connected app is
        never blank. On disconnect the device clears pending state and restarts advertising.
      </Callout>

      <section aria-labelledby="wp-app" className="space-y-4">
        <h4 id="wp-app" className="font-semibold text-fg">
          Companion app
        </h4>
        <p className="max-w-3xl text-sm text-muted">
          The Flutter app scans for NUS, connects, negotiates a larger MTU and subscribes to telemetry. A live ring mirror
          re-implements the firmware’s rendering rules, so the phone shows what the ring shows.
        </p>
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-3">
          {[
            ['app_home.png', 'Companion app home: BLE card connected to XIAO-GPS, ring mirror at 12 m SW 214.9°, location card with HDOP 1.1 and 8 satellites', 'Connection, ring mirror, live fix'],
            ['app_controls.png', 'Companion app destination card with map and send buttons, and a manual command card with GET and CLR shortcuts', 'Destination and manual commands'],
            ['app_event_log.png', 'Companion app event log listing scan, connection, ALIGN, BRIGHT and SET exchanges and GPS_STATUS, BEARING and NAV_STATUS telemetry', 'Full protocol log'],
          ].map(([src, alt, cap]) => (
            <figure key={src} className="w-full max-w-[220px]">
              <div className="overflow-hidden rounded-[1.6rem] border-[5px] border-panel-2 bg-panel-2">
                <Image src={img(src)} alt={alt} width={1235} height={2675} className="h-auto w-full" />
              </div>
              <figcaption className="mt-2 text-center text-xs text-muted">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="wp-test" className="space-y-4">
        <h4 id="wp-test" className="font-semibold text-fg">
          Testing without walking
        </h4>
        <p className="max-w-3xl text-sm text-muted">
          PlatformIO build environments swap in different modules behind the same interfaces:
        </p>
        <DataTable
          head={['Environment', 'What it isolates']}
          rows={waypointTestEnvs.map(([e, d]) => [<code key="e" className="font-mono text-accent-strong">{e}</code>, d])}
        />
      </section>
    </div>
  );
}
