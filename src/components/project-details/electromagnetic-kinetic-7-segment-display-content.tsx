/*  pages/projects/electromagnetic-kinetic-7-segment.tsx  */
import Image from 'next/image';
import React from 'react';

const ElectromagneticKinetic7SegmentDisplayContent: React.FC = () => (
  <article className="container mx-auto px-4 py-12 prose lg:prose-lg">
    {/* ────────────── Header ────────────── */}
    <header className="mb-10">
      <p className="text-gray-600">
        A single-digit, ultra-low-power indicator that swaps LEDs for steel-core
        coils and magnets—built to showcase precision electromechanics,
        energy-aware firmware, and rapid-prototyped mechanics.
      </p>
    </header>

    {/* ────────────── Hero / Demo GIF ────────────── */}
    <figure className="mb-12">
      <Image
        src="/assets/electromagnetic-display/demo.gif" // ► replace
        alt="Animated demo of the kinetic digit counting down"
        width={1280}
        height={720}
        className="rounded-xl shadow-lg"
        priority
      />
      <figcaption className="text-center text-sm mt-2">
        Demo: the digit counts&nbsp;9→0 with <code>{'< 25 ms'}</code> pulses &
        zero hold current.
      </figcaption>
    </figure>

    {/* ────────────── Context / Goal ────────────── */}
    <h2>Why a Moving-Segment Digit?</h2>
    <p>
      Traditional LED displays idle at&nbsp;≈250 mA; my goal was a tactile,
      daylight-readable indicator that sips <strong>&lt;3 mA average</strong>.
      Each segment is a PLA bar with an N35 magnet; a 400-turn screw-core coil
      repels or attracts it for&nbsp;25 ms, then consumes nothing until the
      next change.
    </p>

    {/* ────────────── At-a-Glance Stats ────────────── */}
    <div className="grid md:grid-cols-3 gap-4 my-10 text-center">
      <section>
        <h3 className="!m-0 text-2xl font-semibold">400</h3>
        <p className="!mt-1 text-xs uppercase tracking-wide text-gray-500">
          Turns / coil
        </p>
      </section>
      <section>
        <h3 className="!m-0 text-2xl font-semibold">≈ 2.5 mA</h3>
        <p className="!mt-1 text-xs uppercase tracking-wide text-gray-500">
          Avg. current @ 5 V
        </p>
      </section>
      <section>
        <h3 className="!m-0 text-2xl font-semibold">100×</h3>
        <p className="!mt-1 text-xs uppercase tracking-wide text-gray-500">
          Less energy than LEDs
        </p>
      </section>
    </div>

    {/* ────────────── Gallery ────────────── */}
    <h2>Build Gallery</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* 3-D model */}
      <figure className="rounded-lg shadow-sm flex flex-col">
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src="/assets/electromagnetic-display/cad_model.png"
            alt="CAD cut-away of rail & coil"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-sm text-center mt-2">CAD Model</figcaption>
      </figure>

      {/* Coil & driver */}
      <figure className="rounded-lg shadow-sm flex flex-col">
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src="/assets/electromagnetic-display/coil.jpg"
            alt="Hand-wound coil on M3 screw and TB6612 driver board"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-sm text-center mt-2">400-turn screw-core coil=</figcaption>
      </figure>

      {/* Firmware snippet */}
      <figure className="rounded-lg shadow-sm flex flex-col">
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src="/assets/electromagnetic-display/firmware.png"
            alt="Firmware diff-pulse logic"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-sm text-center mt-2">XOR-diff pulse scheduler</figcaption>
      </figure >

      {/* Finished prototype */}
      <figure className="rounded-lg shadow-sm flex flex-col">
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src="/assets/electromagnetic-display/assembly.jpg"
            alt="Completed single-digit module on desk"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-sm text-center mt-2">Assembled module</figcaption>
      </figure>
    </div>

    {/* ────────────── Technical Deep-Dive ────────────── */}
    <h2>Architecture</h2>
    <ul>
      <li>
        <strong>Mechanics  </strong>—M3 screw acts as low-cost steel core; PLA
        rail ensures sub-0.1 mm skew, so a 1 A pulse yields 7 mm travel.
      </li>
      <li>
        <strong>Electronics  </strong>—Seven TB6612 half-bridges tie directly to
        14 GPIOs; future rev will multiplex through a 74HC595 to free I/O.
      </li>
      <li>
        <strong>Firmware  </strong>—Segment font in flash; loop XORs desired vs
        current mask and energises only changed bars (≈3 pulses per minute).
      </li>
      <li>
        <strong>Energy</strong>—Pulse: 0.75 A · 25 ms = 0.018 mAh; 8 pulses/min
        → 2.5 mA avg vs 250 mA LED block → 100 × savings.
      </li>
    </ul>

    {/* ────────────── Critical Reflection ────────────── */}
    <h2>What Worked & What's Next</h2>
    <ul>
      <li>
        <strong>Successes:</strong> repeatable motion, no hold current, and hot-swap coils proved the mechanical concept.
      </li>
      <li>
        <strong>Pain points:</strong> initial coils overheated until I added XOR gating; rail printing demanded ±0.02 mm tolerance.
      </li>
      <li>
        <strong>Roadmap:</strong> shift-register I/O, air-core/keeper redesign to halve pulse current, BLE OTA updates, and a 4-digit backplane PCB.
      </li>
    </ul>

    {/* ────────────── Call-out Footer ────────────── */}
    <footer className="pt-12 border-t">
      <p className="text-sm text-gray-500">
        <em>Built with&nbsp;Fusion 360, KiCad, STM32CubeIDE, and far too many
          coffee beans.</em>
      </p>
    </footer>
  </article>
);

export default ElectromagneticKinetic7SegmentDisplayContent;