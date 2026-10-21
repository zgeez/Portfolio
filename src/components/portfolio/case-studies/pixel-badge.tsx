import { asset } from '@/data/site';
import { CaseSection } from '@/components/projects/project-chapter';
import { Callout, DataTable, Figure, PhoneShot } from '@/components/portfolio/ui';

const img = (name: string) => asset(`assets/pixel-badge/${name}`);

export function PixelBadgeCaseStudy() {
  return (
    <div className="dossier-case-body">
      <CaseSection id="overview" eyebrow="Overview" title="A connected wearable, from the scan engine to the phone app">
        <div className="space-y-4 text-muted">
          <p>I built Pixel Badge to make an introduction tangible: display a name or QR code, tap NFC to open the same destination, and change the content from a phone. Movement drives a small fluid simulation; a microphone adds audio-reactive visuals. Stored artwork and animation let the badge work beyond one fixed demo.</p>
          <p>The design brings a 32×32 white LED matrix, Nordic wireless module, sensors and PCB NFC antenna onto a 118×76 mm board. A removable face and battery carrier make the electronics serviceable. I designed the board, firmware, Flutter app, mechanical assembly and validation tooling as parts of one system.</p>
          <p>The difficult part was making those interfaces agree. A link is applied only after confirmation. A display fault must leave the outputs dark. Updating firmware should preserve settings, artwork and Bluetooth bonds.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
          <Figure src={img('pcb-front-render.webp')} alt="KiCad render of the custom PCB with a 32 by 32 LED field and NFC antenna." width={1568} height={984} priority caption="Populated Rev A PCB in KiCad. CAD render of the custom white-LED design." />
          <Figure src={img('qr-bench.webp')} alt="White QR pattern displayed on a HUB75 panel connected to a breadboard prototype." width={1800} height={2400} kind="Hardware photo" caption="QR running on the larger nRF5340 DK / RGB HUB75 development rig before the wearable board." />
        </div>
      </CaseSection>

      <CaseSection id="architecture" eyebrow="Architecture" title="One interaction, independent responsibilities">
        <div className="space-y-4 text-muted">
          <p>The phone sends content over BLE. Zephyr services validate requests, coordinate persistent state and update the display, NFC or sensors. Display timing, sensing and flash work have separate responsibilities so a slow storage operation does not become the display clock.</p>
          <p>QR and NFC share the selected URL. An external passive tag supports taps independently of the MCU power state by design; the MCU updates its EEPROM over I2C while RF writes remain protected. USB-C and a protected LiPo feed a charger and power-path controller, with separate logic and switchable LED supplies. Firmware sheds display load before logic becomes unstable.</p>
        </div>
        <Figure className="mt-6" src={img('system-architecture.svg')} alt="Architecture diagram connecting the phone, nRF52840, LED matrix, sensors, passive NFC and power domains." width={1200} height={790} caption="Illustrative system responsibilities and power domains. Architecture illustration, not an electrical schematic." />
      </CaseSection>

      <CaseSection id="hardware" eyebrow="Hardware" title="Prototype the risk before shrinking it">
        <div className="space-y-4 text-muted">
          <p>I started with an nRF5340 DK, a HUB75 panel and accessible peripheral modules. A 32×32 window on the larger 2 mm-pitch panel exposed the scan and content problems before custom fabrication. The breadboard kept signals accessible for measurement and wiring changes.</p>
          <p>The custom four-layer board uses an Ebyte nRF52840 module, two constant-current column sinks and high-side row switches for 1:32 multiplexing. An IMU and PDM microphone supply motion and audio input. Two I2C buses separate peripheral responsibilities; power conversion and the NFC antenna share a tightly constrained board.</p>
          <p>Parts availability forced the processor change. All 29 exposed module GPIO were allocated, while 1 MiB of flash had to accommodate firmware slots, banked artwork and settings. I retained separate prototype and Rev A build targets around shared domain services.</p>
        </div>
        <Figure className="mt-6" src={img('integrated-breadboard.webp')} alt="Dense prototype wiring connects the Nordic DK, NFC breakout and HUB75 panel." width={1800} height={1350} kind="Hardware photo" caption="Integrated nRF5340 development rig with NFC breakout and display cable. The custom board uses the nRF52840." />
      </CaseSection>

      <CaseSection id="firmware" eyebrow="Firmware" title="The scan engine is a scheduling problem">
        <div className="space-y-4 text-muted">
          <p>Each row needs shifted data, a latch transition and a bounded illumination interval. Outputs stay blank during transitions. The Rev A engine assigns SPI, timer and PPI/GPIOTE resources to this sequence, with separate scan-stall hardware providing a route to a dark display if scanning stops.</p>
          <p>I made recovery observable. Initialization alone does not prove scan progress; stale sensor values cannot qualify power recovery. Boot health distinguishes an intentionally disabled matrix from a persistent fault. Workers keep flash and peripheral operations outside the timing-critical path.</p>
          <p>Artwork uses a banked flash area with capacity for 128 encoded frames. Settings and bonds occupy a separate region. Transfers check metadata, CRC and exact readback, so a successful BLE write cannot masquerade as successfully applied content.</p>
        </div>
        <Figure className="mt-6" src={img('timing-shift.webp')} alt="Logic-analyzer close-up of clock, data, latch and blank signals." width={1800} height={650} kind="Recorded capture" caption="Serial shifting and latch timing on the October 9 nRF5340 signal bench, with no matrix connected. Electrical capture of the prototype configuration." />
      </CaseSection>

      <CaseSection id="app" eyebrow="Companion app" title="Editing is part of the embedded interface">
        <div className="space-y-4 text-muted">
          <p>The Flutter app has five workspaces: Badge, Links, Text, Studio and Audio. It handles text and QR configuration, drawing, image/GIF/video conversion, animation timing, a local draft library and local audio playback. Transfer and readback progress make the device state visible.</p>
          <p>Some imported artwork already contained a rendered grid of dots. Ordinary resizing sampled the gaps and created a checker pattern. I added conservative dot-grid extraction with a source override, while retaining area filtering for ordinary images. I also separated “connected” from “ready to edit”: artwork readback after reconnect needs its own loading state.</p>
        </div>
        <div className="mt-6 grid justify-items-center gap-5 sm:grid-cols-3">
          <PhoneShot className="pixel-badge-app-shot" src={img('app-badge.png')} alt="Pixel Badge badge workspace in dark mode." width={1170} height={2532} caption="Badge workspace. Synthetic Flutter widget-test capture." />
          <PhoneShot className="pixel-badge-app-shot" src={img('app-links.png')} alt="Pixel Badge links workspace in dark mode." width={1170} height={2532} caption="Links workspace. Synthetic Flutter widget-test capture." />
          <PhoneShot className="pixel-badge-app-shot" src={img('app-studio.png')} alt="Pixel Badge studio workspace in dark mode." width={1170} height={2532} caption="Studio workspace. Synthetic Flutter widget-test capture." />
        </div>
      </CaseSection>

      <CaseSection id="mechanics" eyebrow="Mechanical design" title="Replaceable parts and testable fits">
        <div className="space-y-4 text-muted">
          <p>The carrier takes battery and mounting loads. A separate magnetic backing sits inside the fabric; lanyard tabs provide another attachment option. The removable face exposes the matrix and controls and marks the NFC tap area.</p>
          <p>I modeled an M2 thread coupon before committing to a large PETG part. A later floor operation refilled the magnet pockets, so I recut them and checked the final 0.6 mm skins. A one-body PCB dummy, with the rear JST omitted for flat printing, supports fit checks. These CAD checks establish geometry; printed thread life and garment retention require physical measurements.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Figure src={img('carrier-covered.webp')} alt="Fusion model of the enclosed badge with an LED window and engraved NFC mark." width={1800} height={1200} caption="Fusion CAD assembly with the optional front face, matrix window and NFC mark." />
          <Figure src={img('thread-fit-coupon.webp')} alt="Two-boss printed-thread fit coupon shown in Fusion." width={1600} height={1100} caption="CAD model of the M2 thread coupon, using the carrier bosses’ nominal geometry." />
        </div>
      </CaseSection>

      <CaseSection id="debugging" eyebrow="Debugging" title="Follow the failure across boundaries">
        <div className="space-y-6 text-muted">
          <section>
            <h3 className="mb-2 font-medium text-fg">An upload that looked like a radio failure</h3>
            <p>A large animation upload stopped and the DK entered watchdog-loop safe mode. I found that the shortest row timer started before shifting finished: a compare could expire inside the ISR and starve the watchdog thread. Starting the slot after shifting removed that hazard. Separately, negotiating MTU before artwork readback fixed a misleading reconnect delay. A 93-frame, 36,297-byte clip then uploaded and read back, with scan progress observed afterward. The original first watchdog trigger was not captured.</p>
          </section>
          <section>
            <h3 className="mb-2 font-medium text-fg">A processor change became a contract check</h3>
            <p>Moving to the available nRF52840 module tightened both pins and flash. I checked the compiled configuration against all 43 module schematic pads and added negative checks for incorrect latch pins and overlapping partitions. Both target builds fit their recorded budgets. This established source consistency; physical bring-up remains a separate test.</p>
          </section>
          <section>
            <h3 className="mb-2 font-medium text-fg">An I2C response was insufficient evidence</h3>
            <p>The BQ25620 charger requires additional low-power bus timing at 400 kHz that the controller could not insert. I moved the shared charger/IMU bus to 100 kHz and kept sensing freshness visible to power policy. This was a datasheet-driven correction; one successful bench response could not validate every power state.</p>
          </section>
        </div>
      </CaseSection>

      <CaseSection id="validation" eyebrow="Validation" title="Match each result to its method">
        <p className="mb-5 text-muted">I used software regressions, hardware contracts and physical development captures for different questions. The records below are dated project evidence, with each result kept within its test conditions.</p>
        <DataTable head={['Evidence', 'Recorded result', 'Scope']} rows={[
          ['October 9 · DK signal bench', '39,485 shifts; zero pattern or row-order errors. Latches inside BLANK; output blanked during a ~2.012 s CPU halt.', 'No matrix connected. Electrical timing, not final-board optical refresh or stall-circuit validation.'],
          ['October 11 · QR screening', '18 settings, three successful trials each; distance adjusted with brightness.', 'Owner-reported prototype screening, not a fixed-distance acceptance rate.'],
          ['October 17 · upload recovery', '93-frame clip applied and read back; MTU 247 negotiated first. Repair milestone: 115 Flutter tests.', 'One DK/app recovery transaction and dated software regressions, not a soak test.'],
          ['October 18 · port contract', '43 schematic pads matched; wrong-pin and overlapping-partition inputs rejected.', 'Build/configuration consistency, not final hardware acceptance.'],
          ['Carrier CAD/export', 'Final pocket skins and closed meshes checked; 358 PCB candidate pairs clear.', 'Model geometry, not physical fit, wear or thermal validation.'],
        ]} />
        <div className="mt-6 space-y-4">
          <Figure src={img('timing-row.webp')} alt="Logic-analyzer traces showing row slots, latch and blanking timing." width={1800} height={813} kind="Recorded capture" caption="October 9 DK row timing. Captured latch pulses occurred inside blanking; this does not measure final-board optical brightness." />
          <Figure src={img('timing-halt.webp')} alt="Logic-analyzer capture spanning a CPU halt and restart." width={1800} height={816} kind="Recorded capture" caption="BLANK stayed asserted during the recorded DK CPU halt. Rev A scan-stall hardware is a separate design." />
          <Callout title="Physical measurements to add">
            Final-board optical refresh, battery runtime, passive NFC range, thermal behavior and garment retention need their own measured conditions. They are not inferred from software tests or CAD.
          </Callout>
        </div>
      </CaseSection>

      <CaseSection id="reflection" eyebrow="Reflection" title="Make success observable at every interface">
        <div className="space-y-4 text-muted">
          <p>Pixel Badge taught me to define success at the boundaries: scan progress, exact content readback, fresh sensing and inspectable mechanical geometry. Each makes a failure easier to isolate before it becomes a misleading app message or an expensive board revision.</p>
          <p>My next refinements are a cleaner fabrication and bring-up workflow, display comparisons across viewing conditions, and a more compact carrier informed by measured assembly clearances. The small interaction is useful because the timing, state, power and physical design work together.</p>
        </div>
      </CaseSection>
    </div>
  );
}
