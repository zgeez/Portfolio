# Full project dossiers

All nine `/projects/[slug]/` routes use the accepted workbench project layout. Each document has a fixed 28° artifact illustration, a flat reading surface, project-specific chapters, documented headline results or design specifications, real media, and a persistent Back to workbench control. The homepage keeps its angled desk.

Preview: `npm run build` then `npm start`, at <http://localhost:4173/>. Nothing has been deployed as part of this implementation.

## Project map

| Project | Bench target | Presentation |
| --- | --- | --- |
| STM32 Mixed-Signal Instrument | `#stm32` | Discovery board; instrument, system, firmware, hardware, signals, measurements, validation, limits, source |
| EEG Acquisition & Neurofeedback | `#eeg` | ADS1299/MMB0 stack; acquisition, processing, classification, debugging, privacy/scope, limits |
| LED Waypoint Compass | `#waypoint` | LED-ring enclosure; system, firmware, navigation, BLE protocol, debugging |
| Kinetic 7-Segment Display | `#kinetic` | Magnetic digit; mechanics, electronics, XOR firmware, energy budget, reflection |
| Smart Security Camera | `#camera` | Camera/board illustration; detection architecture, implementation, optimization, dashboard, results |
| IoT Device Automation | `#iot` | Modular node illustration; architecture, firmware/power, app, challenges, stack |
| Wireless Charging Roads Simulation | `#charging` | Study preview; problem, method, simulated results, validation, impact |
| iGuard | `#iguard` | Phone preview; features, architecture, screens, challenges |
| Pixel Badge | `#badge` | Dedicated workbench badge and illustration; overview, architecture, hardware, firmware, app, mechanics, debugging, scoped validation, reflection |

Illustrations represent project navigation rather than an exact hardware schematic. Real photographs, diagrams, captures, and videos remain the evidence. The phone/study header uses the existing project thumbnail. Projects without documented headline metrics do not receive invented numbers.

## Shared components and content

- `src/components/projects/project-dossier.tsx`: shared server-rendered layout, headline results, resources, bench links, and next project.
- `src/components/projects/project-artifact.tsx`: angled artifact headers; the three flagship devices reuse the bench illustrations.
- `src/components/projects/chapter-navigation.tsx`: native chapter anchors, active chapter tracking, mobile rail positioning, and history normalization.
- `src/components/projects/project-chapter.tsx`: section headings and technical layer chapters. Every chapter is in the static HTML; the old depth dial/tab shell is removed.
- `src/components/projects/evidence-figure.tsx`: full-size native image dialogs with Escape, captions, and browser-managed focus restoration.
- `src/components/projects/project-dossier.css`: workbench palette, responsive reading/evidence layout, sticky return bar, and touch controls.
- `src/data/project-dossiers.ts`: chapter maps, titles, artifact types, and existing case-study headline metrics.
- `src/components/portfolio/abstraction/` and `case-studies/`: preserved technical content, diagrams, tables, limitations, research scope, and demos.

The STM32 time cursor and latency wake-path demonstration, Waypoint state/heading explorers, kinetic XOR demonstration, recorded videos, measured tables, and component probe details remain available. Figures and phone screenshots expand without leaving the project. Hardware photos and captures keep their captions; evidence categories do not imply new measurements.

## Navigation and accessibility

Existing project URLs, canonical metadata, and `#lens-*` deep links are retained. `#layers` remains an alias anchor for the first technical layer. Debug-story anchors and the logic analyzer's `#lens-signals` link continue to work. Chapter navigation follows document order and stays within the reading flow.

The return bar remains visible while scrolling. Mobile chapter links scroll horizontally, with active chapters brought into the rail's view. Component selectors provide 44px touch controls in addition to diagram keyboard/pointer interaction. Native image dialogs make the surrounding document inert, close with Escape, and restore focus to the opener.

Without JavaScript, the full narrative, media, tables, videos, chapter links, and bench links are still available. Component details have native `<details>` fallbacks. Image expansion controls appear only after hydration. Reduced motion stops decorative diagram flow and suppresses transitions through the existing global preference handling.

## Verification and captures

Run `npm run check` for typecheck, lint, and the production static export. With the static server and installed headless Chrome running on debugger port 9333, run `node scripts/verify-projects.mjs` and `node scripts/verify-bench.mjs`. Both use Node's built-in WebSocket; `BENCH_ORIGIN` and `BENCH_DEBUGGER` can override endpoints.

The project checker exercises all nine documents and their chapters at 1440, 1024, 768, 390, and 320px; metadata/static content; real media; image dialogs; component selection; retained demos; native deep-link history; bench return; next project; reduced motion; and JavaScript-disabled reading. The bench checker verifies the desk, inspections, all project links, and existing navigation contracts. Browser coverage is Chrome.

Verification passed on October 7, 2026: typecheck, lint, production static export, and both browser suites. Chrome reported no runtime, hydration, or media errors. Desktop and mobile captures below show the implemented layout.

Pixel Badge added October 21, 2026. Its headline figures are design/capacity specifications; CAD, synthetic app captures and DK signal-bench evidence are labeled separately. Public source links remain absent for the private firmware repository. It has a dedicated selectable `#badge` workbench object, an inspection with curated CAD/prototype media, and matching project return links.

The workbench groups the logic analyzer and debugger beside the laptop at the top right, with short USB loops joining the tools to the laptop. Contact sits at the bottom, including at the end of the mobile reading order. Pixel Badge sits beside the development board in the center, with the kinetic display at the middle right. The compact 2200×1240 desktop plane keeps the three object bands close together with balanced horizontal spacing; camera geometry and rendered dimensions share the same constants. Mobile reading order places the badge before the kinetic display. The shared `badge-board.svg` illustration follows the PCB CAD proportions, using a 32×32 surface-mount LED field, copper NFC loop with ZG mark, driver packages, radio module, buttons and USB-C connector. It is a navigational drawing rather than hardware evidence.

App screenshots were rendered directly from the Pixel Badge Flutter app (0.10.3+31) with synthetic fixtures, real Roboto/Material fonts, a 390×844 logical viewport and `RenderRepaintBoundary.toImage(pixelRatio: 3)`. The 1170×2532 lossless PNGs replace 260×590 montage crops. The copied app and capture helper live in ignored `build/pixel-badge-app/`; the original badge project is unchanged. Screenshot presentation removes both the montage framing and the added CSS border. Browser checks verify source resolution on 2× displays, border removal, the badge inspection, return navigation and next-project wraparound.

October 21 verification passed: Flutter capture test, typecheck/lint/production build, `verify-projects.mjs`, `verify-bench.mjs` and `verify-bench-visuals.mjs`. The badge fits desktop/tablet/mobile/landscape layouts without caption collisions. Direct hash changes now update the focus-return target, so Escape from `#badge` restores focus to the badge. To retain fresh audit captures without overwriting documentation images, set `BENCH_CAPTURES` and `PROJECT_CAPTURES` to directories under `docs/audit/captures/`.

| Project | Desktop | Mobile |
| --- | --- | --- |
| STM32 | [Desktop](stm32-desktop.png) | [Mobile](stm32-mobile.png) |
| EEG | [Desktop](eeg-desktop.png) | [Mobile](eeg-mobile.png) |
| Waypoint | [Desktop](waypoint-desktop.png) | [Mobile](waypoint-mobile.png) |
| Kinetic display | [Desktop](kinetic-desktop.png) | [Mobile](kinetic-mobile.png) |
| Security camera | [Desktop](camera-desktop.png) | [Mobile](camera-mobile.png) |
| IoT automation | [Desktop](iot-desktop.png) | [Mobile](iot-mobile.png) |
| Charging simulation | [Desktop](charging-desktop.png) | [Mobile](charging-mobile.png) |
| iGuard | [Desktop](iguard-desktop.png) | [Mobile](iguard-mobile.png) |
| Pixel Badge | [Desktop](pixel-badge-desktop.png) | [Mobile](pixel-badge-mobile.png) |

Additional captures: [System probe](stm32-system.png), [Signal explorer](stm32-signals.png), [Mobile document](stm32-mobile-content.png).
