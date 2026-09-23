import Image from 'next/image';
import React from 'react';

const asset = (name: string) => `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/waypoint-compass/${name}`;

/* ────────────── LED ring diagram ────────────── */
// Colours follow the firmware's NeoPixel values, brightened for screen.
const LED = {
  forward: '#ff3b30',
  target: '#00e5ff',
  warn: '#ff1744',
  trail: '#2962ff',
  idle: '#4dd0e1',
  arrived: '#00e676',
  amber: '#ffc400',
  amberDim: '#8d6e00',
};

type RingState = {
  name: string;
  trigger: string;
  pixels: (string | null)[];
  pulse?: boolean;
};

const fill = (c: string | null) => Array<string | null>(16).fill(c);
const pointer = (target: number, targetColor: string) => {
  const p = fill(null);
  p[(target + 1) % 16] = LED.trail;
  p[(target + 15) % 16] = LED.trail;
  p[target] = targetColor;
  p[0] = LED.forward;
  return p;
};

const RING_STATES: RingState[] = [
  { name: 'Idle', trigger: 'No destination stored', pixels: fill(LED.idle), pulse: true },
  { name: 'No GPS fix', trigger: 'All pixels blink red', pixels: fill(LED.forward), pulse: true },
  {
    name: 'Need heading',
    trigger: 'Fix, but no IMU heading or course yet',
    pixels: Array.from({ length: 16 }, (_, i) => (i % 2 === 0 ? LED.amber : LED.amberDim)),
  },
  { name: 'Navigating', trigger: 'Cyan target, blue trail, red forward', pixels: pointer(3, LED.target) },
  { name: 'Low accuracy', trigger: 'HDOP > 6, < 4 sats, stale fix or IMU', pixels: pointer(11, LED.warn) },
  { name: 'Arrived', trigger: 'Within 2 m of the destination', pixels: fill(LED.arrived) },
];

const LedRing: React.FC<{ state: RingState }> = ({ state }) => (
  <figure className="!my-0 flex flex-col items-center text-center">
    <svg
      viewBox="0 0 120 120"
      className={`w-28 h-28 sm:w-32 sm:h-32 ${state.pulse ? 'motion-safe:animate-pulse' : ''}`}
      role="img"
      aria-label={`${state.name}: ${state.trigger}`}
    >
      <circle cx="60" cy="60" r="58" fill="#f3f4f6" stroke="#d1d5db" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#1b1f24" strokeWidth="15" />
      {state.pixels.map((color, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 16;
        const x = 60 + 44 * Math.cos(a);
        const y = 60 + 44 * Math.sin(a);
        return (
          <g key={i}>
            {color && <circle cx={x} cy={y} r="9" fill={color} opacity="0.35" />}
            <rect
              x={x - 4.5}
              y={y - 4.5}
              width="9"
              height="9"
              rx="1.5"
              fill={color ? '#ffffff' : '#ecece8'}
              transform={`rotate(${(i * 360) / 16} ${x} ${y})`}
            />
            <circle cx={x} cy={y} r="2.6" fill={color ?? '#d4d4cf'} />
          </g>
        );
      })}
      <text x="60" y="64" textAnchor="middle" fontSize="9" fill="#6b7280">
        ▲ fwd
      </text>
    </svg>
    <figcaption className="mt-2">
      <span className="block text-sm font-semibold text-gray-800">{state.name}</span>
      <span className="block text-xs text-gray-500 leading-snug">{state.trigger}</span>
    </figcaption>
  </figure>
);

/* ────────────── Phone screenshot frame ────────────── */
const Phone: React.FC<{ src: string; alt: string; caption: string }> = ({ src, alt, caption }) => (
  <figure className="!my-0 flex flex-col items-center">
    <div className="rounded-[2rem] border-[6px] border-gray-900 bg-gray-900 shadow-xl overflow-hidden w-full max-w-[240px]">
      <Image src={src} alt={alt} width={1235} height={2675} className="!my-0 w-full h-auto" />
    </div>
    <figcaption className="text-center text-sm mt-3 max-w-[240px]">{caption}</figcaption>
  </figure>
);

const LedWaypointCompassContent: React.FC = () => (
  <article className="container mx-auto px-4 py-0 prose lg:prose-lg prose-code:before:content-none prose-code:after:content-none">
    {/* ────────────── Header ────────────── */}
    <header className="mb-10">
      <p className="text-gray-600">
        A handheld navigator that points instead of mapping. An ESP32-S3 fuses GPS position with a BNO08x IMU
        heading and drives a <strong>16-pixel LED ring</strong>: one red pixel marks the way the device is facing,
        and a cyan pointer marks the way to the destination. Line the two up and walk. A Flutter companion app
        sends destinations over <strong>Bluetooth Low Energy</strong> and shows live telemetry, but once a
        destination is stored the device navigates on its own.
      </p>
      <p className="text-sm text-gray-500">
        Firmware in C++ on the Arduino framework with PlatformIO · NimBLE · Companion app in Flutter
      </p>
    </header>

    {/* ────────────── Hero Image ────────────── */}
    <figure className="mb-12 flex flex-col items-center">
      <Image
        src={asset('app_and_ring.jpg')}
        alt="At night, a phone running the LED Compass Companion app connected to XIAO-GPS shows latitude 40.620667, longitude -74.030255, HDOP 1.1 with 8 satellites and a bearing of 214.9 degrees south-west at 0.012 km; beside it the compass ring shows a red forward pixel flanked by two blue pixels"
        width={1800}
        height={1244}
        className="rounded-xl shadow-lg w-full max-w-4xl"
        priority
      />
      <figcaption className="text-center text-sm mt-2">
        Live session: the app reports a bearing of 214.9° SW at 12 m, and the ring agrees. The blue trail pixels
        straddle the red forward pixel, which means the destination is dead ahead.
      </figcaption>
    </figure>

    {/* ────────────── Project Overview ────────────── */}
    <h2>Project Overview</h2>
    <p>
      Turn-by-turn navigation assumes roads and a screen you are willing to stare at. For a short walk to a
      pinned spot, such as a meeting point, a campsite or a parked car, all you really need is the direction
      and whether you are getting closer. This project reduces navigation to that: <strong>a direction you can
      read at a glance, from a device that keeps working if the phone goes away.</strong>
    </p>
    <p>
      Every second the firmware solves the same problem. Where am I (GPS), where am I going (the stored
      destination), which way am I facing (IMU), and so which pixel should light? The answer drives the ring
      and streams to the phone as structured telemetry. Destinations and calibration live in flash, so a reboot
      picks up exactly where the walk left off.
    </p>

    {/* ────────────── Key Figures ────────────── */}
    <div className="bg-blue-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4 text-blue-800">At a Glance</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <h4 className="text-2xl font-bold text-blue-700 !my-1">&lt;2°</h4>
          <p className="text-sm text-blue-600 !my-0">Heading Deviation<br />BNO08x Rotation Vector</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-blue-700 !my-1">22.5°</h4>
          <p className="text-sm text-blue-600 !my-0">Per Pixel<br />16-Pixel Ring</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-blue-700 !my-1">1 Hz</h4>
          <p className="text-sm text-blue-600 !my-0">BLE Telemetry<br />GPS, Nav &amp; Bearing</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-blue-700 !my-1">2 m</h4>
          <p className="text-sm text-blue-600 !my-0">Arrival Radius<br />Great-Circle Distance</p>
        </div>
      </div>
    </div>

    {/* ────────────── Architecture ────────────── */}
    <h2>System Architecture</h2>
    <div className="not-prose my-8 grid gap-3 md:grid-cols-[1fr_auto_1.3fr_auto_1fr] items-stretch text-sm">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="font-semibold text-gray-900">Sensors</p>
        <ul className="mt-2 space-y-1 text-gray-600">
          <li><span className="font-medium text-gray-800">GT-U7 GPS</span> · UART, 9600 baud NMEA</li>
          <li><span className="font-medium text-gray-800">BNO08x IMU</span> · I²C, 400 kHz</li>
        </ul>
      </div>
      <div className="hidden md:flex items-center text-gray-400 text-xl" aria-hidden>→</div>
      <div className="rounded-lg border-2 border-teal-600 bg-teal-50 p-4 shadow-sm">
        <p className="font-semibold text-teal-900">Seeed XIAO ESP32-S3</p>
        <ul className="mt-2 space-y-1 text-teal-900/80">
          <li>TinyGPS++ fix parsing and quality gating</li>
          <li>Quaternion → compass heading</li>
          <li>Distance, bearing and ring state</li>
          <li>NVS: destination and heading offset</li>
        </ul>
      </div>
      <div className="hidden md:flex items-center text-gray-400 text-xl" aria-hidden>⇄</div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="font-semibold text-gray-900">Outputs</p>
        <ul className="mt-2 space-y-1 text-gray-600">
          <li><span className="font-medium text-gray-800">NeoPixel ring</span> · 16 px, brightness 4–255</li>
          <li><span className="font-medium text-gray-800">Flutter app</span> · BLE Nordic UART Service</li>
        </ul>
      </div>
    </div>
    <p>
      The main loop polls GPS, IMU and BLE without blocking, solves navigation, renders the ring and, once a
      second, publishes telemetry. Each module owns one peripheral and exposes a few plain functions, so the
      same navigation and ring code builds against real or simulated sensors (see{' '}
      <a href="#testing">Testing Without Walking</a>).
    </p>

    {/* ────────────── Reading the Ring ────────────── */}
    <h2>Reading the Ring</h2>
    <p>
      The ring is the whole interface, so every state had to be readable without a legend after one walk.
      The firmware renders a strict priority order: no destination, no fix, arrived, no heading, then the live
      pointer. The device never shows a direction it cannot justify.
    </p>

    <div className="not-prose my-8 rounded-lg bg-gray-50 p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
        {RING_STATES.map((s) => (
          <LedRing key={s.name} state={s} />
        ))}
      </div>
    </div>

    <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
      <figure className="!my-0">
        <Image
          src={asset('enclosure_ring.jpg')}
          alt="Top of the white 3D-printed enclosure with the 16-pixel ring set into it: the forward pixel at the top glows red, and at the bottom a red target pixel sits between two cyan trail pixels"
          width={1400}
          height={1400}
          className="rounded-lg shadow-md w-full h-auto"
        />
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          Destination behind. The target turns red while accuracy is flagged.
        </figcaption>
      </figure>
      <figure className="!my-0">
        <Image
          src={asset('ring_turning.jpg')}
          alt="The ring in the dark: a single red forward pixel on one side and, well around the ring from it, a red target pixel flanked by two blue trail pixels"
          width={1000}
          height={1000}
          className="rounded-lg shadow-md w-full h-auto"
        />
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          Off course: forward and target pixels far apart, telling you which way to turn.
        </figcaption>
      </figure>
      <figure className="!my-0">
        <Image
          src={asset('ring_arrived.jpg')}
          alt="All sixteen ring pixels glowing solid green"
          width={1000}
          height={1000}
          className="rounded-lg shadow-md w-full h-auto"
        />
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          Arrived: solid green inside the 2 m radius.
        </figcaption>
      </figure>
    </div>

    <div className="bg-yellow-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-3 text-yellow-800">Honest About Uncertainty</h3>
      <p className="text-sm text-yellow-900 mb-0">
        A compass that points confidently in the wrong direction is worse than no compass. The firmware flags a
        fix as poor when <strong>HDOP exceeds 6, fewer than 4 satellites are used, or the fix is older than
        2 s</strong>, and flags the heading when the BNO08x&apos;s own accuracy estimate exceeds 0.35 rad
        (about 20°). Either condition turns the target pixel red and makes the forward pixel blink faster. The
        pointer keeps working, but it tells you to slow down or wait for a better fix.
      </p>
    </div>

    {/* ────────────── Heading ────────────── */}
    <h2>From Quaternion to Pixel</h2>
    <p>
      The BNO08x runs its own sensor fusion and reports an <strong>AR/VR-stabilized rotation vector</strong>, a
      quaternion with an accuracy estimate. The firmware extracts yaw, converts it from the sensor&apos;s
      counter-clockwise-from-east convention to a compass heading measured clockwise from north, and applies a
      mounting offset so pixel 0 matches the physical front of the enclosure.
    </p>
    <pre className="text-xs sm:text-sm"><code>{`// imu_module.cpp: quaternion → yaw → compass heading
yaw     = atan2(2(qw·qz + qx·qy), 1 − 2(qy² + qz²))
heading = normalize(90° − yaw + mountOffset)

// navigation → ring
delta   = wrap(bearing − heading)     // shortest turn, −180°..180°
pixel   = round(delta / 22.5°) mod 16 // relative to the forward pixel`}</code></pre>
    <p>
      The bearing and distance to the destination are the great-circle initial course and distance from the
      current fix, computed with TinyGPS++. Taking the shortest signed turn before quantizing avoids a
      classic bug: a pointer that jumps across the ring when the heading crosses north.
    </p>

    <div className="grid md:grid-cols-2 gap-6 my-8">
      <section className="bg-green-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-green-800">🔹 Heading Failover</h3>
        <ul className="text-sm">
          <li>IMU heading preferred whenever it is valid</li>
          <li>Falls back to GPS course-over-ground once moving</li>
          <li>Amber &ldquo;need heading&rdquo; state when neither exists</li>
          <li>Heading expires after 500 ms without IMU data</li>
        </ul>
      </section>
      <section className="bg-purple-50 p-6 rounded-lg">
        <h3 className="!mt-0 text-lg font-semibold mb-3 text-purple-800">🔹 IMU Self-Recovery</h3>
        <ul className="text-sm">
          <li>Probes both BNO08x addresses, 0x4B then 0x4A</li>
          <li>Re-enables reports after a sensor reset</li>
          <li>Reinitializes after 1.5 s of stalled heading</li>
          <li>2 s retry backoff so a missing IMU never stalls the loop</li>
        </ul>
      </section>
    </div>

    {/* ────────────── BLE Protocol ────────────── */}
    <h2>BLE Command Protocol</h2>
    <p>
      The device advertises as <code>XIAO-GPS</code> and exposes the <strong>Nordic UART Service</strong> over
      NimBLE: one write characteristic for commands and one notify characteristic for replies and telemetry.
      Using NUS means any generic BLE terminal can drive the device, not only the companion app. Commands are
      short text lines, validated on the device, and every reply is mirrored to USB serial for debugging.
    </p>
    <div className="overflow-x-auto my-8">
      <table className="text-sm w-full">
        <thead>
          <tr>
            <th>Command</th>
            <th>Effect</th>
            <th>Reply</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>SET &lt;lat&gt; &lt;lon&gt;</code></td>
            <td>Store a destination; rejects out-of-range coordinates</td>
            <td><code>OK SET lat=… lon=…</code></td>
          </tr>
          <tr>
            <td><code>GET</code></td>
            <td>Report the stored destination</td>
            <td><code>STORED …</code> / <code>NO_STORED_DEST</code></td>
          </tr>
          <tr>
            <td><code>CLR</code></td>
            <td>Clear the destination</td>
            <td><code>OK CLEARED</code></td>
          </tr>
          <tr>
            <td><code>BRIGHT &lt;n&gt;</code></td>
            <td>Ring brightness, clamped to 4–255</td>
            <td><code>LED_BRIGHT n</code></td>
          </tr>
          <tr>
            <td><code>ALIGN AUTO | RESET | ? | &lt;deg&gt;</code></td>
            <td>Zero, restore, query or set the IMU mounting offset</td>
            <td><code>IMU_ALIGN offset=…</code></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Telemetry is structured as <code>key=value</code> pairs. Every optional field carries a matching{' '}
      <code>_valid</code> flag and a <code>?</code> placeholder, so the app never has to guess whether a zero
      means zero or missing. Sequence numbers make dropped notifications visible.
    </p>
    <pre className="text-xs sm:text-sm whitespace-pre-wrap break-all"><code>{`GPS_STATUS seq=41 fix=1 lat=40.620667 lat_valid=1 lon=-74.030255 lon_valid=1 hdop=1.1 hdop_valid=1 sats=8 sats_valid=1 age_ms=99 …
BEARING 214.9 SW dist_m=12 cog=? head=213.8 hdop=1.1 sats=8 age_ms=99 lat=40.620667 lon=-74.030255
NAV_STATUS seq=41 state=ACTIVE reason=NAVIGATING dest=1 fix=1 warn=0 at_dest=0 bearing_deg=214.9 distance_m=12.3 …`}</code></pre>
    <p>
      Two details make the link dependable. A reply produced before the phone subscribes to notifications is
      held and <strong>flushed on subscription</strong> rather than lost, and a full status snapshot is sent the
      moment a client becomes ready, so a freshly connected app is never blank for a second. On disconnect the
      device clears pending state and restarts advertising on its own.
    </p>

    {/* ────────────── Persistence ────────────── */}
    <div className="bg-gray-50 p-6 rounded-lg my-8">
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2 !mt-0">Survives a Reboot</h4>
          <ul>
            <li>Destination in the <code>dest</code> NVS namespace</li>
            <li>IMU mounting offset in the <code>imu</code> namespace</li>
            <li>Restored at boot, before BLE starts advertising</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 !mt-0">Works Without the Phone</h4>
          <ul>
            <li>The phone is only needed to set a destination</li>
            <li>GPS, IMU and ring run entirely on the device</li>
            <li>Power-cycle mid-walk and navigation resumes</li>
          </ul>
        </div>
      </div>
    </div>

    {/* ────────────── Companion App ────────────── */}
    <h2>Companion App</h2>
    <p>
      The Flutter app scans for the NUS service, connects, negotiates a larger MTU and subscribes to
      telemetry. Destinations are picked on a Google Map and sent with one tap. A live{' '}
      <strong>ring mirror</strong> re-implements the firmware&apos;s rendering rules, so the phone shows what
      the ring shows: useful when the device is in a pocket or on a handlebar.
    </p>

    <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-8 my-10 justify-items-center">
      <Phone
        src={asset('app_home.png')}
        alt="Companion app home screen: BLE card connected to XIAO-GPS, an LED ring mirror showing 12 m to the destination at SW 214.9 degrees with the red forward pixel between two blue trail pixels, and a device location card with HDOP 1.1 and 8 satellites"
        caption="Connection, ring mirror and live fix"
      />
      <Phone
        src={asset('app_controls.png')}
        alt="Companion app scrolled down: destination card with Choose on map, Send to device and Clear selection buttons, and a manual command card with shortcuts for GET and CLR"
        caption="Destination and manual commands"
      />
      <Phone
        src={asset('app_event_log.png')}
        alt="Companion app event log listing the scan, connection, ALIGN and BRIGHT exchanges, the SET command, and GPS_STATUS, BEARING and NAV_STATUS telemetry lines"
        caption="Full protocol log, TX in green and RX in blue"
      />
    </div>

    <figure className="my-8 flex flex-col items-center">
      <Image
        src={asset('app_ring_turn.png')}
        alt="Ring mirror card reading 48 m, SW 214.9 degrees, with the cyan target pixel three positions clockwise of the red forward pixel and the instruction Turn 57 degrees right"
        width={1190}
        height={1191}
        className="rounded-xl w-full max-w-sm"
      />
      <figcaption className="text-center text-sm mt-2">
        Heading 158°, bearing 214.9°: the mirror places the target three pixels clockwise and says so in words.
      </figcaption>
    </figure>

    {/* ────────────── Testing ────────────── */}
    <h2 id="testing">Testing Without Walking</h2>
    <p>
      Navigation code is tedious to test by walking around a block. PlatformIO build environments swap in
      different modules behind the same interfaces:
    </p>
    <div className="overflow-x-auto my-8">
      <table className="text-sm w-full">
        <thead>
          <tr>
            <th>Environment</th>
            <th>What It Isolates</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fake_gps</code></td>
            <td>
              A synthetic fix orbiting a 15 m circle once every two minutes, with consistent course and speed.
              It exercises bearing, ring rendering and BLE telemetry at a desk.
            </td>
          </tr>
          <tr>
            <td><code>gps_test</code></td>
            <td>GPS wiring, baud rate and NMEA flow; flags a silent UART within a second.</td>
          </tr>
          <tr>
            <td><code>bno08x_test</code></td>
            <td>I²C bus scan and raw BNO08x reports, independent of the navigation stack.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      On the app side, unit tests feed real firmware lines through the parser and check the ring mirror
      against the firmware&apos;s pixel rules. That work caught a real bug: the destination echo{' '}
      <code>OK SET lat=… lon=…</code> matched the position pattern and briefly moved the device&apos;s location
      on the map to its own destination. The app screenshots on this page are rendered by the same test
      harness, from the same telemetry lines.
    </p>

    {/* ────────────── Footer ────────────── */}
    <footer className="pt-12 border-t">
      <p className="text-sm text-gray-500">
        <em>
          Built with PlatformIO on the Arduino-ESP32 framework using NimBLE-Arduino, TinyGPS++, Adafruit BNO08x and
          Adafruit NeoPixel, with a Flutter companion app using flutter_reactive_ble and Google Maps. Demonstrates
          sensor fusion, BLE GATT protocol design, state-driven embedded UI, non-volatile configuration, and
          cross-platform mobile integration.
        </em>
      </p>
    </footer>
  </article>
);

export default LedWaypointCompassContent;
