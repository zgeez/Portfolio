# Claude Code Implementation Brief — Ziad Ghanem Portfolio

## Mission

Redesign the existing `zgeez/portfolio` Next.js site into a memorable embedded/firmware portfolio with one clear signature interaction:

> **The Abstraction Lens** — visitors can peel a real embedded system from **Product → System → Firmware → Hardware → Signals**.

The site must work at two depths simultaneously:

1. **Fast path:** a recruiter or casual visitor understands who Ziad is, sees impressive proof, and can reach the resume/GitHub/projects within 10–30 seconds.
2. **Deep path:** a firmware engineer can keep drilling into architecture, RTOS/task behavior, DMA, peripherals, timing, debugging, tests, measurements, limitations, and source artifacts.

The visual language is **minimal technical / instrument-grade**, not cyberpunk cosplay. Think modern oscilloscope/logic-analyzer UI + premium engineering documentation.

The site should feel like this idea:

> **Simple at the surface. Engineering depth underneath.**

---

# 0. Read This First

Before editing anything:

1. Inspect the repository structure and current implementation.
2. Run the existing site locally and capture the current baseline.
3. Preserve all current factual project content unless it is deliberately reorganized.
4. Do **not invent metrics, task names, DMA stream numbers, performance results, hardware behavior, or test results**.
5. Treat the current repository/project writeups as the source of truth. If a claim cannot be verified from current source material, omit it or label a visualization as illustrative.
6. Keep GitHub Pages static export working at:
   - `https://zgeez.github.io/portfolio/`
   - `basePath: /portfolio`
   - `assetPrefix: /portfolio`
7. Do not replace the project with a different framework. Keep Next.js + React + TypeScript + Tailwind.
8. Do not add a heavy 3D framework. The “wow” factor should come from purposeful interaction, SVG/CSS, real engineering information, and motion—not Three.js spectacle.

---

# 1. Current Repo Facts / Constraints

The repo currently uses:

- Next.js `15.2.3`
- React `18`
- TypeScript
- Tailwind CSS `3.4.x`
- App Router
- static export via `output: 'export'`
- output directory `portfolio`
- GitHub Pages deployment from `master`
- dynamic project route:
  - `src/app/projects/[slug]/page.tsx`
- current project registry:
  - `src/components/sections/projects-section.tsx`
- current project detail components:
  - `src/components/project-details/*`
- global styling:
  - `src/app/globals.css`
  - `tailwind.config.ts`
- GitHub Pages config:
  - `next.config.ts`
- GitHub Actions deploy:
  - `.github/workflows/deploy.yml`

Important existing assets include:

- `public/assets/stm32-msi/mixed_capture.png`
- `public/assets/stm32-msi/workspace.png`
- EEG screenshots/media under `public/assets/eeg-neurofeedback/`
- Waypoint Compass media under `public/assets/waypoint-compass/`
- security-camera media
- IoT media
- electromagnetic-display media
- wireless-charging media

There is a very large kinetic-display GIF (~49 MB) and another multi-megabyte GIF. These must not be loaded eagerly on the homepage.

---

# 2. Design Direction

## Core concept

Use **abstraction** as the interaction model.

Every flagship project should work like this:

```text
PRODUCT
  ↓
SYSTEM
  ↓
FIRMWARE
  ↓
HARDWARE
  ↓
SIGNALS
```

A visitor should be able to stop at any layer.

Do not force the user to understand the gimmick to use the site. Normal scrolling/clicking must remain intuitive.

## Visual language

Use a restrained instrument/engineering theme:

- graphite / near-black background
- slightly lighter technical panels
- off-white primary text
- muted steel/blue-gray secondary text
- cyan/teal as main interaction accent
- limited secondary blue accent
- amber only for warnings/debug callouts
- red only for errors / HardFault Easter egg
- subtle grid/schematic background details
- thin borders
- small glows only around active measurements/selected nodes
- generous whitespace
- large clean sans-serif headings
- monospace only for:
  - timing values
  - addresses
  - protocol labels
  - register/debug information
  - technical metadata

Avoid:

- Matrix green everywhere
- fake hacker-terminal intros
- typing animations on every page load
- giant neon gradients
- excessive glitch effects
- spinning 3D boards
- animations that do not explain something

## Suggested CSS variables

Use these as a starting point, but tune visually:

```css
--bg: #060a0d;
--bg-elevated: #0a1116;
--panel: #0c151b;
--panel-2: #101b22;
--text: #edf6f7;
--text-muted: #8ca2aa;
--border: #1b3038;
--grid: rgba(100, 200, 210, 0.055);

--accent: #54e6ce;
--accent-strong: #73f2dc;
--accent-blue: #6eb4ff;
--warning: #f2b85b;
--danger: #ff6262;
```

Keep contrast WCAG-friendly.

---

# 3. UX Goal

## 10-second experience

Within the first viewport, the visitor should know:

- Ziad Ghanem
- Embedded / Firmware Engineer
- builds systems where software meets physical hardware
- works with STM32 / ESP32 / FreeRTOS / C/C++ / sensing / instrumentation
- has serious measured project results
- can click Resume / GitHub / Explore Projects immediately

## 30-second experience

The visitor should see:

- STM32 Mixed-Signal Instrument
- EEG Acquisition / Neurofeedback
- LED Waypoint Compass
- real metrics attached to each
- evidence that Ziad debugs and measures systems rather than only building demos

## 5–20 minute experience

A firmware engineer should be able to inspect:

- architecture
- FreeRTOS/task structure
- DMA
- timer synchronization
- ADC/DAC/GPIO behavior
- USB protocol
- signal captures
- failure/root-cause stories
- test/validation evidence
- limitations
- source/release links

---

# 4. Homepage — Required Structure

Replace the current “project grid + credentials” homepage with the following hierarchy.

## 4.1 Header

Desktop:

```text
ZIAD|GHANEM

Systems   Research   Experience   About                 GitHub   Resume
```

Mobile:
- compact logo/name
- accessible menu
- no overdesigned drawer

Header should be sticky but subtle.

The `|` or small signal-like separator in the wordmark may use the teal accent.

---

## 4.2 Hero

Required copy direction:

```text
EMBEDDED & FIRMWARE ENGINEER

Ziad Ghanem

I build systems where software meets physical hardware.

STM32 · ESP32 · FreeRTOS · C/C++ · Sensing · Instrumentation

[ Explore Systems ]   [ Resume ]
```

Add GitHub as an icon/link nearby.

### Hero visual

Do **not** fabricate a fake photorealistic product.

Use one of:

1. a composition built from the real STM32 project `workspace.png` / `mixed_capture.png`, or
2. a clean SVG system illustration driven by verified project facts.

The visual should subtly preview the abstraction idea.

Example:

- top layer: “Mixed-Signal Instrument”
- faint architecture lines behind it
- small live-looking signal traces
- labels such as:
  - `PC APP`
  - `USB CDC`
  - `STM32F407`
  - `AWG`
  - `SCOPE`
  - `LOGIC`

Do not overwhelm the headline.

---

## 4.3 Proof strip

Immediately under the hero:

```text
9.882 MS/s        0.22 ms          7 DMA streams       8-channel EEG
logic capture     median USB RTT   STM32 MSI           24-bit @ 250 Hz
```

Use concise labels.

Verified STM32 values from the current project writeup include:

- `9.882 MS/s` logic capture
- `-120 ns` analog/digital skew
- `0.221 ms` median command latency after fix
- `206 kB/s` capture throughput
- `7 concurrent DMA streams`
- `4 FreeRTOS tasks`
- `28 commands`
- `93.13 µHz` DDS frequency step
- `206 Python tests`
- `9 C unit suites`
- `92.8%` C line coverage
- `89%` Python coverage

Use the cleaner rounded display form `0.22 ms` on summary surfaces.

Do not add claims not present in the project source.

---

## 4.4 Featured Systems

Make the first three cards dominant:

### 01 — STM32 Mixed-Signal Instrument
Show:
- AWG + oscilloscope + logic analyzer
- `9.882 MS/s`
- `0.22 ms`
- `-120 ns`
- STM32F407 / FreeRTOS / DMA / USB CDC

### 02 — EEG Acquisition & Neurofeedback
Show only verified facts:
- 8 channels
- 24-bit acquisition
- 250 Hz
- ESP32-S3 + ADS1299
- MATLAB processing
- ~83% best mental-math block accuracy if using rounded homepage copy

### 03 — LED Waypoint Compass
Show:
- ESP32
- BLE / Nordic UART Service
- BNO08x
- GPS + orientation / bearing
- state-driven LED navigation
- NVS persistence

Project cards must show **why the project is technically interesting** without requiring a click.

Each card:
- real project media
- title
- one-sentence technical hook
- 2–3 micro-metrics/technologies
- “Explore layers →”

Secondary projects can live under “More Systems”:
- Kinetic 7-Segment Display
- Smart Security Camera
- IoT Device Automation
- Wireless Charging Simulation
- iGuard

Do not give certifications equal visual weight to flagship engineering work.

---

# 5. Signature Feature — The Abstraction Lens

This is the most important feature in the redesign.

Implement it first on:

`/projects/stm32-mixed-signal-instrument/`

## 5.1 UI

Desktop concept:

```text
ABSTRACTION LENS

      ◉
      │
PRODUCT    ●
SYSTEM     ○
FIRMWARE   ○
HARDWARE   ○
SIGNALS    ○

Scroll or drag to go deeper
```

Alternative horizontal form is acceptable on narrower layouts:

```text
PRODUCT ─ SYSTEM ─ FIRMWARE ─ HARDWARE ─ SIGNALS
   ●
```

The control should feel like an **instrument control**, not a generic range slider.

Possible details:
- encoder/knob visual
- subtle detent animation
- tick marks
- current layer label
- small depth indicator

### Controls must support

- click/tap layer
- keyboard arrows
- Home/End
- mouse wheel only when the control has deliberate focus/hover
- touch swipe is optional
- normal page scroll must never be hijacked globally

The user must always be able to use the page without the special gestures.

---

## 5.2 Transition behavior

Changing layers should feel like “peeling away” abstraction:

- Product → image/product shell fades
- System → architecture appears
- Firmware → system boxes refine into tasks/data paths
- Hardware → tasks refine into peripherals/timers/ADC/DAC/GPIO
- Signals → actual capture/measurement layer

Use:
- opacity
- transforms
- SVG line morph/fade
- light parallax

Do not use expensive 3D.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Reduced motion should switch layers instantly or with minimal fade.

---

# 6. STM32 Abstraction Layers — Exact Content

## L0 — Product

Purpose: recruiter / casual reader.

Show:

- project name
- one-line purpose
- `2-channel AWG`
- `2-channel oscilloscope`
- `8-channel logic analyzer`
- STM32F407
- FreeRTOS
- USB CDC
- source/release CTAs

Hero metrics:

- `9.882 MS/s` logic capture
- `0.22 ms` median command latency
- `206 kB/s` capture throughput
- `-120 ns` analog/digital skew

Short description:

> A USB bench instrument built on an STM32F407 Discovery board that generates, captures, and correlates analog and digital signals from one device.

Include the real `workspace.png` where useful.

---

## L1 — System

Show an interactive SVG architecture:

```text
┌──────────────────┐
│ PC Application   │
│ Python / PySide6 │
└────────┬─────────┘
         │
         │ USB CDC
         │ COBS-framed binary protocol
         │
┌────────▼──────────┐
│ STM32F407 +       │
│ FreeRTOS          │
└───────┬───────────┘
        │
   ┌────┼──────────┐
   │    │          │
   ▼    ▼          ▼
  AWG  SCOPE     LOGIC
```

Verified facts to surface:
- binary protocol
- 28 commands
- COBS framing
- PySide6 desktop application
- STM32F407VGT6 / Cortex-M4
- generator can run alongside acquisition
- scope and logic acquisition are mutually exclusive

### Probe interaction

Hover or focus architecture nodes to reveal a small technical popover.

Examples:

**USB CDC**
- versioned binary protocol
- COBS framing
- 28 commands
- post-fix 0.22 ms median command RTT

**STM32F407**
- ARM Cortex-M4
- FreeRTOS
- four tasks
- seven concurrent DMA streams

**Scope**
- two analog inputs
- 1 MS/s on two channels
- ADC + DMA
- pre-trigger support

**Logic**
- 8 inputs
- 9.882 MS/s
- UART/SPI/I2C decoding

These popovers are the “probe the system” interaction.

---

## L2 — Firmware

Show a tasteful RTOS/task visualization.

Verified current writeup says the four responsibilities are separated into:

- waveform refill
- acquisition
- USB control
- status

Use those names unless the source repo proves more exact task names.

Do **not** invent priorities or exact scheduling periods unless verified.

The timeline can be explicitly labeled:

> **Architecture visualization — not a measured RTOS trace**

unless real trace data exists.

Also show:

- 7 concurrent DMA streams
- binary protocol
- control/task notification path
- refill behavior
- backpressure/fault checks
- no invented memory-allocation claims

### Highlight the USB notification bug

Make this a first-class debug story:

```text
SYMPTOM
~20 ms quantized request latency

OBSERVATION
Every transfer was an exact multiple of ~20 ms

HYPOTHESIS
Timeout/scheduling path, not bandwidth

ROOT CAUSE
tasks_notify_control() existed but CDC callbacks never invoked it

FIX
Notify the control task from RX/TX-complete callbacks

RESULT
19.997 ms → 0.221 ms median command RTT
2.40 kB/s → 206 kB/s capture throughput
```

This should feel like a concise engineering postmortem, not a marketing card.

---

## L3 — Hardware

Show verified peripheral relationships.

Safe verified items:

```text
STM32F407VGT6
│
├─ TIM1
│   └─ trigger output
│        ↓
│      TIM2 (slaved)
│
├─ DAC
│   └─ 2 waveform outputs
│
├─ ADC
│   └─ 2 scope inputs
│
├─ GPIO
│   └─ 8-channel logic sampling
│
└─ USB FS / CDC
```

Show:
- shared timer-derived timebase
- TIM1 trigger releasing slaved TIM2
- DAC + DMA
- dual ADC + DMA
- GPIO sampling + DMA
- `7 concurrent DMA streams` as a verified count

Do **not** show exact DMA controller/stream-number mappings unless they are verified from firmware source.

If exact mapping is later verified, update the visualization from data rather than hardcoding it in JSX.

---

## L4 — Signals

Use the real project capture:

`public/assets/stm32-msi/mixed_capture.png`

Present it in a purpose-built measurement panel.

Show the core verified timing story:

- one shared hardware start
- analog/digital capture plotted on one time axis
- measured skew: `-120 ns`
- measured skew is consistent with the ADC sample-and-hold aperture (`143 ns` in current writeup)

Important nuance from current content:

> A shared hardware start does not mean both peripherals sample at the exact same instant.

Explain this clearly.

### Interactive signal explorer

Preferred implementation order:

1. Search the current repo and the `stm32-mixed-signal-instrument` project for real exported numeric capture data.
2. If real numeric data exists, build the waveform viewer from it.
3. If no numeric data exists:
   - use the real screenshot as the evidence
   - optionally overlay movable explanatory cursors
   - **do not synthesize a waveform and present it as a measured capture**

If an illustrative waveform is used anywhere, label it explicitly:

> Illustrative timing diagram

Never label fabricated values “live,” “measured,” or “recorded.”

---

# 7. Easter Egg — “Break Abstraction”

At the deepest STM32 layer, add a discreet optional control:

```text
BREAK ABSTRACTION
```

It should be discoverable but not visually dominant.

When activated:

1. Briefly transition the panel into a red-tinted diagnostic state.
2. Show:

```text
SIMULATED CORTEX-M HARDFAULT

HARDFAULT
CFSR ...
HFSR ...
PC   ...
LR   ...

watchdog recovery...
SYSTEM RECOVERED ✓
```

Rules:

- clearly label it **SIMULATED**
- never imply the portfolio actually crashed
- no loud sound
- no flashing/strobing
- automatically recovers within ~2–3 seconds
- Escape/click dismisses immediately
- reduced-motion mode shows a static debug card instead

The goal is a subtle firmware-engineer Easter egg, not a prank.

---

# 8. Homepage Debug Stories

Add a compact section:

```text
DEBUG LOG
```

Use 2–3 high-value stories.

### STM32 USB latency
`20 ms → 0.22 ms`

### STM32 synchronization
shared hardware trigger → remaining `-120 ns` → ADC acquisition behavior

### EEG marker/data quality
task markers / artifact handling / acquisition integrity

Each story should show:

```text
symptom → measurement → hypothesis → root cause → fix → result
```

Keep homepage versions very short; link to project detail.

---

# 9. Skills as Abstraction Layers

Replace a generic badge wall with an evidence-oriented stack:

```text
APPLICATION
Python · PySide6 · MATLAB

SYSTEM
FreeRTOS · Linux

FIRMWARE
C · C++

PROTOCOLS
USB · BLE · SPI · I2C · UART · MQTT

HARDWARE
STM32 · ESP32 · ARM Cortex-M

PERIPHERALS
ADC · DAC · DMA · Timers · GPIO

DEBUG
JTAG/SWD · Oscilloscope · Logic Analyzer · DMM
```

Each skill should optionally link/highlight projects that demonstrate it.

Do not turn this into a giant skill cloud.

---

# 10. Project Page Layout

Keep the existing technical depth but reorganize it.

Every flagship project page should begin with:

1. title
2. one-sentence system purpose
3. role / ownership
4. verified technology chips
5. 3–4 measured results
6. GitHub / release/demo links
7. abstraction lens or architecture overview

Then:

```text
Overview
Architecture
Implementation
Debugging
Measurements
Validation / Testing
Limitations
Source / Releases
```

Do not delete good current technical prose. Reorganize and compress repetitive sections.

The strongest project pages should feel closer to an engineering case study than a marketing landing page.

---

# 11. Project Priorities

Implement/refine in this order:

1. **STM32 Mixed-Signal Instrument**
2. **EEG Acquisition & Neurofeedback**
3. **LED Waypoint Compass**
4. Kinetic 7-Segment Display
5. Smart Security Camera
6. IoT Device Automation
7. Wireless Charging Simulation
8. iGuard

Homepage should visually prioritize 1–3.

---

# 12. Proposed Component Architecture

Refactor toward this structure where practical:

```text
src/
  app/
    page.tsx
    globals.css
    projects/
      [slug]/
        page.tsx

  components/
    portfolio/
      header.tsx
      hero.tsx
      proof-strip.tsx
      featured-projects.tsx
      project-card.tsx
      debug-log.tsx
      skills-stack.tsx
      experience-section.tsx
      contact-footer.tsx

      abstraction/
        abstraction-lens.tsx
        abstraction-control.tsx
        abstraction-layer.tsx
        stm32/
          product-layer.tsx
          system-layer.tsx
          firmware-layer.tsx
          hardware-layer.tsx
          signals-layer.tsx
          probe-node.tsx
          hardfault-easter-egg.tsx
          signal-explorer.tsx

  data/
    projects.ts
    stm32-msi.ts

  components/
    project-details/
      ...
```

Do not refactor every old project into a new content system before shipping the redesign.

Prefer incremental migration.

---

# 13. Move Project Metadata Out of UI Component

The current `projects` array lives in:

`src/components/sections/projects-section.tsx`

Move project metadata to:

`src/data/projects.ts`

Suggested model:

```ts
export type ProjectMetric = {
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  shortTitle?: string;
  summary: string;
  image: string;
  imageHint: string;
  category: "firmware" | "research" | "embedded-linux" | "iot" | "software";
  featured: boolean;
  order: number;
  technologies: string[];
  metrics?: ProjectMetric[];
  githubUrl?: string;
  demoUrl?: string;
};
```

Keep all values factual.

The homepage and project route should import from the same source.

---

# 14. STM32 Data Must Be Data-Driven

Create:

`src/data/stm32-msi.ts`

Store verified architecture labels/metrics in one place.

Example:

```ts
export const stm32Metrics = [
  { value: "9.882 MS/s", label: "8-channel logic capture" },
  { value: "0.221 ms", label: "median command RTT" },
  { value: "206 kB/s", label: "capture throughput" },
  { value: "-120 ns", label: "analog/digital skew" },
];

export const stm32Layers = [
  { id: "product", label: "Product" },
  { id: "system", label: "System" },
  { id: "firmware", label: "Firmware" },
  { id: "hardware", label: "Hardware" },
  { id: "signals", label: "Signals" },
] as const;
```

Do not duplicate metrics across many files.

---

# 15. Interaction Details

## Project cards

Hover:
- image moves very slightly
- border becomes accent
- key metric becomes brighter
- small line/trace animation may run

No huge scale effect.

## Architecture nodes

Hover/focus:
- connected path highlights
- unrelated nodes fade slightly
- technical popover appears

Click:
- lock selection until clicked elsewhere

## Abstraction lens

- active layer: accent
- previous layers: subtle
- deeper layers: dim
- changing layer animates content in <450 ms
- do not trap scroll

## Signal graphics

SVG is preferred for:
- waveforms
- timing arrows
- architecture paths
- cursor lines

Canvas is acceptable only if actual interaction/performance justifies it.

---

# 16. Motion Rules

Every animation must answer one of these:

- What data is moving?
- What layer am I looking at?
- What component is connected?
- What changed because of my action?
- What measurement am I inspecting?

If it answers none of those, remove it.

Recommended durations:

- hover: 120–180 ms
- normal state transition: 180–300 ms
- abstraction layer transition: 250–450 ms
- Easter egg sequence: max ~3 s total

No continuous GPU-heavy animation.

---

# 17. Accessibility

Required:

- semantic landmarks
- keyboard navigable
- visible focus
- all interactive SVG nodes keyboard-accessible
- `aria-label` / accessible text for abstraction controls
- color is not the only state indicator
- reduced-motion support
- images have useful alt text
- no automatic audio
- no strobe/flicker
- controls minimum comfortable touch target
- mobile must not require hover

The portfolio should remain understandable with JavaScript interaction ignored or reduced.

---

# 18. Performance

Critical.

## Existing media cleanup

The kinetic display GIF is extremely large (~49 MB).

Convert large GIFs to:
- `.webm` and/or `.mp4`
- poster image
- `preload="none"` or `metadata`
- lazy load below the fold

Do not autoplay large videos on mobile.

## General targets

Aim for:

- LCP ≤ 2.5 s
- CLS ≤ 0.1
- INP ≤ 200 ms
- no giant JS bundle for visual gimmicks
- minimal client components

Use Server Components by default.

Only use `"use client"` for actual interaction.

Do not add Three.js unless the user explicitly requests it later.

---

# 19. Build Quality / Engineering Signal

The site represents a firmware engineer. The codebase should signal rigor.

Current `next.config.ts` suppresses TypeScript and ESLint build failures.

Improve this safely.

### TypeScript

Remove:

```ts
typescript: {
  ignoreBuildErrors: true,
}
```

only after fixing all type errors.

`npm run typecheck` must pass.

### ESLint

If a working ESLint setup is absent:
- add a Next 15-compatible ESLint configuration
- add/fix the `lint` script
- resolve genuine issues

Do not blindly add lint suppression.

### CI

Update GitHub Actions to run before deployment:

```text
npm ci
npm run typecheck
npm run lint
npm run build
```

If lint setup requires a separate staged commit, do that safely.

Do not break GitHub Pages publishing.

---

# 20. Remove Dead Scaffold Only After Verification

The repo currently contains Genkit/Firebase-related packages/files that may be unused by the visible portfolio.

Before removing anything:

1. search imports/usages
2. confirm it is not used
3. remove package(s), files, and lockfile entries together
4. build

Potential cleanup candidates include:
- `src/ai/*`
- Genkit dependencies
- Firebase/react-query packages if genuinely unused

Do not do broad dependency deletion without proof.

---

# 21. SEO / Metadata

Update root metadata:

Title direction:

```text
Ziad Ghanem — Embedded & Firmware Engineer
```

Description direction:

```text
Embedded and firmware engineering portfolio featuring STM32, ESP32, FreeRTOS, real-time acquisition, sensing, instrumentation, and hardware/software debugging.
```

Each project should retain project-specific metadata.

Add:
- Open Graph metadata
- canonical path where practical for static export
- social preview image later if no suitable current image exists

Do not block implementation on a perfect OG image.

---

# 22. Experience / Research

Add a compact homepage section, not a full resume dump.

Current positioning:

### New York Institute of Technology
EEG Researcher

Emphasize:
- embedded acquisition
- ADS1299
- ESP32-S3
- 8-channel / 24-bit / 250 Hz
- signal processing / experimentation

### Other experience
Keep concise:
- Technical AI Trainer
- Software engineering/client work

The portfolio is for embedded/firmware positioning, so do not let unrelated software work dominate.

Resume remains the detailed employment source.

---

# 23. Credentials

Current homepage gives credentials too much prominence.

Change to a small lower-page section:

```text
Education & Selected Credentials
```

Keep:
- NYIT B.S./M.S.
- key honors
- only selected relevant certifications

Do not use a giant certificate-logo wall.

---

# 24. Mobile Behavior

Mobile must be intentionally designed, not a collapsed desktop.

### Homepage
- headline first
- metrics in 2×2 grid
- project cards stacked
- diagrams horizontally scroll only if unavoidable

### Abstraction lens
Use:
- horizontal layer stepper, or
- compact vertical stepper

Do not require rotary knob precision on touch.

### Architecture
Tap a node to inspect it.
Popovers become bottom sheets/cards if needed.

### Signal viewer
Pinch/complex gesture support is unnecessary in v1.
Use simple draggable cursors if numeric data is available.

---

# 25. Do Not Fake “Live” Data

A major credibility rule:

If data is replayed:
- label it `RECORDED RUN`

If animation is illustrative:
- label it `ILLUSTRATIVE`

If HardFault is an Easter egg:
- label it `SIMULATED`

Never fake:
- live CPU usage
- live RTOS task load
- DMA activity
- packet throughput
- sensor data
- test results

A firmware hiring manager will notice.

---

# 26. Implementation Phases

## Phase 1 — Baseline / Foundation

- run current app
- fix obvious build warnings
- create design tokens
- create new header
- move project metadata to `src/data/projects.ts`
- preserve all current routes
- verify static export

Deliverable:
- site still works
- no major visual redesign yet
- project metadata centralized

---

## Phase 2 — Homepage

Implement:

- new header
- hero
- proof strip
- featured projects
- debug log
- skills abstraction stack
- compact experience/research
- compact education/credentials
- contact/footer

Deliverable:
- recruiter-ready homepage
- three flagship projects clearly dominate

---

## Phase 3 — STM32 Abstraction Lens

Implement:

- abstraction control
- Product layer
- System layer
- Firmware layer
- Hardware layer
- Signals layer
- probeable architecture
- debug story
- real capture image
- GitHub/releases links

Deliverable:
- signature portfolio interaction works on desktop + mobile

---

## Phase 4 — “Wow” Polish

Implement:

- refined layer transitions
- probe path highlighting
- subtle signal animation where factual/illustrative distinction is clear
- HardFault Easter egg
- reduced-motion behavior
- mobile refinement

Deliverable:
- memorable but still professional

---

## Phase 5 — EEG + Waypoint

Apply progressive disclosure to these projects.

Do **not** force the full five-layer implementation if a different set of layers better matches the system.

EEG example:

```text
PRODUCT
SYSTEM
ACQUISITION
SIGNAL PROCESSING
CLASSIFICATION
```

Waypoint example:

```text
PRODUCT
SYSTEM
FIRMWARE
SENSOR / NAV ALGORITHM
PROTOCOL / HARDWARE
```

The principle matters more than identical labels.

---

## Phase 6 — Performance / QA / CI

- convert huge GIF media
- lazy loading
- image/video posters
- TypeScript strict build
- lint
- accessibility
- keyboard
- reduced motion
- mobile
- production build
- static export
- GitHub Pages base path
- broken-link check

---

# 27. Validation Commands

Run repeatedly:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

Then serve the generated static output locally and inspect:

- `/portfolio/`
- every project route
- direct deep-link navigation
- refresh on project routes
- all images under the `/portfolio` base path
- GitHub/resume links
- mobile widths
- no hydration errors

If the repo’s current scripts differ after inspection, adapt correctly rather than forcing these exact commands.

---

# 28. Acceptance Checklist

The implementation is not done until all of these are true.

## Homepage

- [ ] identity understood in <10 seconds
- [ ] STM32 / EEG / Waypoint are the top three systems
- [ ] hero contains no fake product render
- [ ] strong metrics visible without scrolling far
- [ ] Resume + GitHub obvious
- [ ] no certificate wall
- [ ] mobile is clean

## Abstraction Lens

- [ ] Product → System → Firmware → Hardware → Signals
- [ ] click/tap works
- [ ] keyboard works
- [ ] reduced motion works
- [ ] normal scroll is not hijacked
- [ ] layer transitions are smooth
- [ ] facts are accurate
- [ ] architecture nodes are probeable
- [ ] no invented DMA stream numbers/priorities

## STM32 engineering evidence

- [ ] 9.882 MS/s represented correctly
- [ ] 0.221/0.22 ms represented correctly
- [ ] 206 kB/s represented correctly
- [ ] -120 ns represented correctly
- [ ] four-task architecture represented without inventing details
- [ ] seven DMA stream count represented
- [ ] USB CDC bug story included
- [ ] real mixed-capture asset used
- [ ] limitations retained
- [ ] source + releases linked

## Easter egg

- [ ] marked SIMULATED
- [ ] recoverable
- [ ] no strobe
- [ ] reduced-motion safe
- [ ] does not interfere with serious content

## Performance / quality

- [ ] huge GIFs removed from eager homepage path
- [ ] no heavy 3D package
- [ ] TypeScript passes
- [ ] lint passes
- [ ] build passes
- [ ] static export works
- [ ] GitHub Pages base path works
- [ ] mobile works
- [ ] focus states visible
- [ ] all interactive diagrams have non-hover access

---

# 29. Important Factual Guardrails

Use the current code/project pages as factual source.

Especially:

### STM32

Verified current project-page facts include:

- STM32F407 Discovery / STM32F407VGT6
- ARM Cortex-M4
- C + FreeRTOS
- 4 tasks
- 7 concurrent DMA streams
- 2-channel AWG
- 2-channel oscilloscope
- 8-channel logic analyzer
- logic capture at 9.882 MS/s
- scope at 1 MS/s on two channels
- shared hardware start using TIM1 trigger output and slaved TIM2
- measured analog/digital skew -120 ns
- ADC sample-and-hold aperture 143 ns
- 28-command versioned binary protocol
- COBS framing
- USB CDC
- PySide6 host application
- 19.997 ms → 0.221 ms command round-trip median
- 2.40 kB/s → 206 kB/s capture throughput
- 206 Python tests
- 9 C unit suites
- 92.8% C line coverage
- 89% Python coverage
- 28-record validation report
- explicit stated limitations

Do not replace these with older resume values if they conflict with the current project page.

### EEG

Current project material supports:

- TI ADS1299
- ESP32-S3
- 8-channel
- 24-bit
- 250 Hz
- MATLAB acquisition/processing
- Welch PSD / bandpower
- artifact gating
- synchronized task markers
- Random Forest
- best mental-math block accuracy about 82.9%
- broader multi-task model about 79.4%
- teacher/student dashboard

Do not convert research results into medical/diagnostic claims.

---

# 30. Final Standard

The finished portfolio should not feel like:

> “A developer made a firmware-themed website.”

It should feel like:

> “An embedded engineer turned the website itself into a layered technical system.”

The key experience should be:

> **You don't just open project pages. You peel the systems apart.**

A recruiter should leave impressed quickly.

A firmware engineer should keep discovering deeper architecture, measurements, debug evidence, limitations, and code.

That is the bar.
