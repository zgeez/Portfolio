# Full project dossiers

All eight `/projects/[slug]/` routes use the accepted workbench project layout. Each document has a fixed 28° artifact illustration, a flat reading surface, project-specific chapters, verified headline results, real media, and a persistent Back to workbench control. The homepage keeps its angled desk.

Preview: `npm run build` then `npm start`, at <http://localhost:4173/portfolio/>. Nothing has been deployed as part of this implementation.

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

The project checker exercises all eight documents and their chapters at 1440, 1024, 768, 390, and 320px; metadata/static content; real media; image dialogs; component selection; retained demos; native deep-link history; bench return; next project; reduced motion; and JavaScript-disabled reading. The bench checker verifies the desk, inspections, all project links, and existing navigation contracts. Browser coverage is Chrome.

Verification passed on October 7, 2026: typecheck, lint, production static export, and both browser suites. Chrome reported no runtime, hydration, or media errors. Desktop and mobile captures below show the implemented layout.

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

Additional captures: [System probe](stm32-system.png), [Signal explorer](stm32-signals.png), [Mobile document](stm32-mobile-content.png).
