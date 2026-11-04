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
          <p>Two assembled Rev A boards arrived on October 30. Bring-up found an assembly defect on the first board and replaced the CPU-driven LED scan with one the peripherals run themselves. It also gave the first battery result: about 22 hours on the pack showing a QR code at half brightness.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
          <Figure src={img('rev-a-qr-hero.webp')} alt="Assembled Rev A Pixel Badge PCB running on its battery and displaying a QR code on its 32 by 32 white LED matrix." width={1800} height={1200} priority kind="Hardware photo" caption="Assembled Rev A board running on its battery and showing a QR code at half brightness." />
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
          <p>Parts availability forced the processor change. All 29 exposed module GPIO were allocated, while 1 MiB of flash had to accommodate firmware slots, banked artwork and settings. I retained separate prototype and Rev A build targets around shared domain services. JLCPCB assembled two boards. I powered them first from a bench supply on the battery connector, then from USB and the pack.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
          <Figure src={img('pcb-front-render.webp')} alt="KiCad render of the custom PCB with a 32 by 32 LED field and NFC antenna." width={1568} height={984} caption="Populated Rev A PCB in KiCad. CAD render of the custom white-LED design." />
          <Figure src={img('rev-a-pcb-rear-carrier.webp')} alt="Back of the Rev A PCB showing labeled bring-up test points next to the printed carrier holding the LiPo battery pack." width={1800} height={1350} kind="Hardware photo" caption="Rear of the Rev A PCB with labeled bring-up test points beside the printed carrier and battery pack." />
        </div>
        <Figure className="mt-4" src={img('integrated-breadboard.webp')} alt="Dense prototype wiring connects the Nordic DK, NFC breakout and HUB75 panel." width={1800} height={1350} kind="Hardware photo" caption="Integrated nRF5340 development rig with NFC breakout and display cable. The custom board uses the nRF52840." />
      </CaseSection>

      <CaseSection id="firmware" eyebrow="Firmware" title="The scan engine is a scheduling problem">
        <div className="space-y-4 text-muted">
          <p>Each row needs shifted data, a latch pulse and a bounded on-time, with the outputs blank during transitions. On Rev A the peripherals run the whole sequence. SPIM2 walks a pre-encoded list of 256 row slots by EasyDMA. TIMER3 compares drive SPI start, latch and blanking through PPI and GPIOTE, and a TIMER4 counter stops the sequence after each 32-row plane. The CPU handles one interrupt per plane, and the scan runs at about 215 frames per second. A separate one-shot circuit blanks the LEDs if latching stops.</p>
          <p>I made recovery observable. Initialization alone does not prove scan progress; stale sensor values cannot qualify power recovery. Boot health distinguishes an intentionally disabled matrix from a persistent fault. Workers keep flash and peripheral operations outside the timing-critical path.</p>
          <p>Artwork uses a banked flash area with capacity for 128 encoded frames. Settings and bonds occupy a separate region. Transfers check metadata, CRC and exact readback, so a successful BLE write cannot masquerade as successfully applied content.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
          <Figure src={img('rev-a-scan-artwork.webp')} alt="Rev A Pixel Badge board displaying a bright white starburst pattern on its 32 by 32 LED matrix with battery and inline USB meter." width={1800} height={1350} kind="Hardware photo" caption="Rev A hardware-sequenced scan running stored artwork at about 215 frames/s (frame counter read over SWD; flicker judged by eye)." />
          <Figure src={img('timing-shift.webp')} alt="Logic-analyzer close-up of clock, data, latch and blank signals." width={1800} height={650} kind="Recorded capture" caption="Serial shifting and latch timing on the October 9 nRF5340 DK prototype signal bench, with no matrix connected." />
        </div>
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
        <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
          <Figure src={img('rev-a-carrier-kit.webp')} alt="Printed black PETG carrier holding the Rev A PCB beside the removable front face, magnetic backing bar and lanyard." width={1800} height={1440} kind="Hardware photo" caption="Printed PETG carrier with the Rev A board installed, removable NFC-marked front face, lanyard and magnetic backing bar." />
          <Figure src={img('rev-a-carrier-enclosed.webp')} alt="Enclosed Pixel Badge with its textured black PETG front face framing the 32 by 32 LED matrix and buttons." width={1800} height={1200} kind="Hardware photo" caption="Removable front face installed over the Rev A matrix and tactile buttons." />
          <Figure src={img('rev-a-magnetic-backing-photo.webp')} alt="Back of the printed PETG carrier held by hand, showing the Rev A silkscreen cutout, lanyard loop and magnetic backing bar." width={1800} height={1582} kind="Hardware photo" caption="Rear of the printed carrier showing the board identification window, lanyard loop and magnetic backing bar." />
          <Figure src={img('carrier-covered.webp')} alt="Fusion model of the enclosed badge with an LED window and engraved NFC mark." width={1800} height={1200} caption="Fusion CAD assembly with the optional front face, matrix window and NFC mark." />
          <Figure src={img('thread-fit-coupon.webp')} alt="Two-boss printed-thread fit coupon shown in Fusion." width={1600} height={1100} caption="CAD model of the M2 thread coupon, using the carrier bosses’ nominal geometry." />
        </div>
      </CaseSection>

      <CaseSection id="bringup" eyebrow="Bring-up" title="Compare two sources before trusting either">
        <p className="mb-6 text-muted">Bringing up the two Rev A boards between October 30 and November 3 meant checking each subsystem from two sides: SWD registers against a meter, timer ticks against wall time, and firmware state against bench behavior.</p>
        <div className="space-y-6 text-muted">
          <section id="postmortem-badge-pads">
            <h3 className="mb-2 font-medium text-fg">One edge of the module was never soldered</h3>
            <p>On the first board the IMU reported about 365 samples per second instead of 100, although its configuration registers read back correctly. Counting the real-time clock over SWD for 10 seconds gave 91,401 ticks: the 32.768 kHz crystal was running near 9.1 kHz while the clock driver still reported it as running. The display’s first-write safety check also failed on the same board. With the core halted, I drove the arm line high and toggled the latch from a timer through PPI. The MCU’s own input register showed both pins switching, but the meter read 0 V on the board nets. Every failing signal sat on one edge of the module, and a continuity check showed four pads with no solder. After a hand reflow the clock counted 327,744 ticks in 10 seconds and the safety path responded. The second board had neither fault.</p>
          </section>
          <section id="postmortem-badge-scan">
            <h3 className="mb-2 font-medium text-fg">33 frames per second was a design limit, not a tuning problem</h3>
            <p>The first Rev A driver woke a thread for each of the 256 row slots in a frame. At its original priority it never blocked: the power manager’s heartbeat froze while the RTC kept counting, and every PC sample read over SWD was in scan code. At a lower priority the scan reached only 33 frames per second, about 115 µs per slot against a 16 µs design, and it flickered. Moving the sequence into SPIM, TIMER, PPI and GPIOTE raised it to about 215 frames per second, and the flicker and faint stray pixels were no longer visible. I used SPIM2 because nRF52840 anomaly 198 affects SPIM3 transmit buffers. Flash erases stall the CPU, so the scan now stops cleanly after its plane, and the safety check runs only when the plane interrupt arrives on time.</p>
          </section>
          <section id="postmortem-badge-charging">
            <h3 className="mb-2 font-medium text-fg">Charging that stopped at room temperature</h3>
            <p>With USB present at power-on, charging stayed off on a bench at about 26 °C. The BQ25620’s default thermistor thresholds put its pre-warm zone at 48.4 % of REGN, which is about 26 °C on this board’s 10 kΩ network without RT2, and my firmware treated any zone other than normal as a stop. It now charges in the pre-cool and pre-warm zones and keeps its own 38 °C cut-off. The charger’s ADC read 496 mA for a 480 mA setting.</p>
          </section>
          <section id="bringup-battery">
            <h3 className="mb-2 font-medium text-fg">Measure the battery instead of assuming it</h3>
            <p>I added a bench logger that writes a 16-byte record to spare flash every two minutes and reads back over SWD without halting the badge. Showing a QR code at half brightness from a full charge, the badge ran about 22 hours before the firmware turned off the LED supply at 3.40 V, while the logic kept running. Mean battery current rose from 128 to 149 mA as the voltage fell, and the brightness ceiling dropped to half at 3.58 V. I replaced generic battery-level thresholds with ones taken from this curve. With the LEDs off the badge still drew about 12 mA, mostly the two LED driver ICs, which have no sleep mode.</p>
          </section>
          <section id="postmortem-badge-fluid">
            <h3 className="mb-2 font-medium text-fg">Pixels that clung to the walls</h3>
            <p>Tilted sideways, most fluid pixels fell to the low edge, but strips stayed along the two side edges. A blocked particle got a sideways nudge whose sign was meant to alternate. Because the update order reverses every step, each particle always got the same sign, so half drifted to each side wall and stayed there. I reproduced it in a host simulation (9 of 192 particles left on the old bottom edge), replaced the nudge with a one-cell slide toward the sideways pull, and added a regression test (1 of 192).</p>
          </section>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
          <Figure src={img('rev-a-fluid-before-fix.webp')} alt="Hand holding the Rev A Pixel Badge board on its battery, with bright white LED strips clinging to both side edges of the 32 by 32 matrix above the bottom pool." width={1675} height={1800} kind="Hardware photo" caption="Rev A board 1 on its battery, before the fix: fluid pixels clung to the side edges." />
          <figure className="dossier-evidence-stage">
            <div className="dossier-evidence-toolbar"><span><i aria-hidden />Recorded capture</span></div>
            <video
              controls
              muted
              loop
              playsInline
              preload="metadata"
              width={540}
              height={720}
              poster={img('rev-a-fluid-poster.webp')}
              aria-label="Rev A Pixel Badge board tilted by hand while running the accelerometer-driven fluid simulation"
              className="dossier-evidence-image"
            >
              <source src={img('rev-a-fluid.mp4')} type="video/mp4" />
            </video>
            <figcaption><span className="dossier-figure-mark">FIG.</span><div>Rev A board 1 running the IMU-driven fluid simulation on its battery (+X right, −Y down).</div></figcaption>
          </figure>
          <Figure src={img('rev-a-charging-bench.webp')} alt="Rev A Pixel Badge board displaying ZIAD on the 32 by 32 matrix with its battery pack and inline USB power meter attached." width={1800} height={1350} kind="Hardware photo" caption="Rev A board 1 on the bench with its battery pack, SWD ribbon and inline USB meter while displaying text." />
          <Figure src={img('rev-a-fluid-settled.webp')} alt="Rev A Pixel Badge board resting flat on the bench with fluid pixels settled cleanly along the bottom edge of the 32 by 32 matrix." width={1800} height={1350} kind="Hardware photo" caption="Fluid pool settled along the bottom edge of the 32×32 matrix with the side walls clear." />
        </div>
      </CaseSection>

      <CaseSection id="debugging" eyebrow="Debugging" title="Follow the failure across boundaries">
        <div className="space-y-6 text-muted">
          <section id="postmortem-badge-upload">
            <h3 className="mb-2 font-medium text-fg">An upload that looked like a radio failure</h3>
            <p>A large animation upload stopped and the DK entered watchdog-loop safe mode. I found that the shortest row timer started before shifting finished: a compare could expire inside the ISR and starve the watchdog thread. Starting the slot after shifting removed that hazard. Separately, negotiating MTU before artwork readback fixed a misleading reconnect delay. A 93-frame, 36,297-byte clip then uploaded and read back, with scan progress observed afterward. The original first watchdog trigger was not captured.</p>
          </section>
          <section id="postmortem-badge-port">
            <h3 className="mb-2 font-medium text-fg">A processor change became a contract check</h3>
            <p>Moving to the available nRF52840 module tightened both pins and flash. I checked the compiled configuration against all 43 module schematic pads and added negative checks for incorrect latch pins and overlapping partitions. Both target builds fit their recorded budgets. This established source consistency; the bring-up chapter covers the physical board.</p>
          </section>
          <section id="postmortem-badge-i2c">
            <h3 className="mb-2 font-medium text-fg">An I2C response was insufficient evidence</h3>
            <p>The BQ25620 charger requires additional low-power bus timing at 400 kHz that the controller could not insert. I moved the shared charger/IMU bus to 100 kHz and kept sensing freshness visible to power policy. This was a datasheet-driven correction; one successful bench response could not validate every power state.</p>
          </section>
        </div>
      </CaseSection>

      <CaseSection id="validation" eyebrow="Validation" title="Match each result to its method">
        <p className="mb-5 text-muted">I used software regressions, hardware contracts, physical development captures and Rev A board measurements for different questions. The records below are dated project evidence, with each result kept within its test conditions.</p>
        <DataTable head={['Evidence', 'Recorded result', 'Scope']} rows={[
          ['October 9 · DK signal bench', '39,485 shifts; zero pattern or row-order errors. Latches inside BLANK; output blanked during a ~2.012 s CPU halt.', 'No matrix connected. Electrical timing, not final-board optical refresh or stall-circuit validation.'],
          ['October 11 · QR screening', '18 settings, three successful trials each; distance adjusted with brightness.', 'Owner-reported prototype screening, not a fixed-distance acceptance rate.'],
          ['October 17 · upload recovery', '93-frame clip applied and read back; MTU 247 negotiated first. Repair milestone: 115 Flutter tests.', 'One DK/app recovery transaction and dated software regressions, not a soak test.'],
          ['October 18 · port contract', '43 schematic pads matched; wrong-pin and overlapping-partition inputs rejected.', 'Build/configuration consistency, not final hardware acceptance.'],
          ['Carrier CAD/export', 'Final pocket skins and closed meshes checked; 358 PCB candidate pairs clear.', 'Model geometry, not physical fit, wear or thermal validation.'],
          ['Oct 30 · Rev A first power', 'No rail shorts; 3.3 V logic rail; 2 mA idle at 3.7 V before firmware. Second board’s diagnostics: 0 failed checks.', 'Two boards; meter resolution 1 mA.'],
          ['Oct 31 · Rev A scan', 'About 215 frames/s hardware-sequenced scan, up from 33; no visible flicker.', 'Frame counter read over SWD; flicker judged by eye; no camera or analyzer capture yet.'],
          ['Oct 30–31 · fault blanking', 'One-shot blanked the LEDs 969–974 µs after the last latch (calculated 760–1,410 µs). Debugger halt and reset leave the matrix dark; an arm-line fault is detected within 5 ms.', 'Firmware-hang and debugger cases; stall timing measured on the second board.'],
          ['Nov 1 · battery', 'About 22 h to load shed at QR, 50 %, 128–149 mA; the LED supply was shed at 3.40 V with the logic still running.', 'One run at one load point; current from the charger’s ADC.'],
          ['Oct 31–Nov 3 · wireless and audio', 'LE Secure Connections passkey pairing and app control; NFC phone read and link change; encrypted recording saved and played back.', 'Observed functional checks; NFC and BLE range not measured.'],
        ]} />
        <div className="mt-6 space-y-4">
          <Figure src={img('timing-row.webp')} alt="Logic-analyzer traces showing row slots, latch and blanking timing." width={1800} height={813} kind="Recorded capture" caption="October 9 DK row timing. Captured latch pulses occurred inside blanking; this does not measure final-board optical brightness." />
          <Figure src={img('timing-halt.webp')} alt="Logic-analyzer capture spanning a CPU halt and restart." width={1800} height={816} kind="Recorded capture" caption="BLANK stayed asserted during the recorded DK CPU halt. Rev A scan-stall hardware is a separate design." />
          <Figure src={img('rev-a-audio-rec.webp')} alt="Rev A Pixel Badge board displaying REC with a level bar next to a phone running the Flutter app Audio workspace." width={1800} height={1350} kind="Hardware photo" caption="Oct 31–Nov 3 audio check: Rev A board showing REC and a level bar while the companion app records encrypted audio (observed)." />
          <Callout title="Still to measure">
            Optical refresh on camera, NFC and BLE range, temperature with a probe while charging, the System OFF shutdown on a real pack, and garment retention. The second board has a 3.3 V regulator fault that I have not localized yet.
          </Callout>
        </div>
      </CaseSection>

      <CaseSection id="reflection" eyebrow="Reflection" title="Make success observable at every interface">
        <div className="space-y-4 text-muted">
          <p>Pixel Badge taught me to define success at the boundaries: scan progress, exact content readback, fresh sensing and inspectable mechanical geometry. Each makes a failure easier to isolate before it becomes a misleading app message or an expensive board revision.</p>
          <p>Bring-up rewarded comparing two independent sources: the IMU rate against the RTC, the RTC against wall time, the MCU’s view of a pin against a meter on the net. A status flag that said the crystal was running was wrong. For a next revision I would put the LED drivers on a switched supply, since they set the idle draw, and add a USB-C PD sink so chargers that advertise only default current can charge the badge faster.</p>
        </div>
      </CaseSection>
    </div>
  );
}
