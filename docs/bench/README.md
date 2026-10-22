# Embedded Lab Bench

The bench is the only portfolio homepage at `/portfolio/`. The old `/overview/` page, homepage sections, and global header/footer have been removed. All eight case studies now use the [full project dossier](../projects/README.md), sharing the workbench palette, angled artifact headers, and return links to their bench inspections. GitHub Pages configuration is retained. This change has not been deployed.

Local preview: `npm run build` then `npm start`, and open `http://localhost:4173/portfolio/`. Development: `npm run dev`, at `http://localhost:9002/portfolio/`.

## What is implemented

- A fixed 28° angled desk with CSS perspective, layered SVG/HTML equipment, restrained shadows, and automatic pan/zoom. No 3D library or new dependency.
- Distinct JTAG/SWD probe with a flat ribbon connector and USB logic analyzer with eight independent channel leads/grabbers. The blue Discovery board and green ADS1299/MMB0 stack have different component/header layouts. The compass follows the photographed white enclosure and LED ring. Scope, laptop, notebook, resume, contact card, and parts tray have their own physical forms.
- All eight projects are accessible through the parts tray. Each has a summary, existing metrics/technologies, a full case study link, and a real media gallery. The three main projects also expose their existing architecture component details.
- Complete existing debugging stories, research/experience descriptions, education, honors, all six credentials, skills by layer, and contact links. Facts come from the repository’s existing data; SVG equipment is a navigation representation, not a claim about a particular commercial device or hardware purchase.
- Separate mobile desk composition, full scrollable inspection content, large touch controls, and selected-object placement above the inspection.
- URL hashes/history, keyboard navigation, accessible tabs/details, Escape, focus restoration, reduced motion, a skip link, and non-JavaScript project links. Objects outside a focused camera view leave Tab order until the overview is restored; pointer selection remains available.

## Main files

- `src/app/page.tsx`: bench homepage.
- `src/app/layout.tsx`: document metadata and content landmark, without the retired global chrome.
- `src/app/globals.css`: workbench palette shared by technical documents.
- `src/components/projects/project-dossier.tsx`: shared project layout and bench return links.
- `src/data/project-dossiers.ts`: project-specific dossier chapters, titles, and artifacts.
- `src/data/bench.ts`: composition, object sizes/focus, fixed angle, inspection registry, project targets, and legacy hash aliases.
- `src/data/bench-content.ts`: real media captions and architecture references.
- `src/components/bench/bench-scene.tsx`: state, history, viewport sizing, selection, focus, and mobile positioning.
- `src/components/bench/bench-camera.tsx`: desk projection and camera fit.
- `src/components/bench/bench-object.tsx`: object links/buttons, labels, and keyboard focus availability.
- `src/components/bench/bench-dock.tsx`: navigation shortcuts.
- `src/components/bench/inspection-overlay.tsx`: fixed inspection header/return control and scrolling body.
- `src/components/bench/inspection-content.tsx`: project tabs/galleries, library, debugging, experience, education/skills/credentials, and contact.
- `src/components/bench/objects/equipment.tsx`: scope, compass, laptop, notebook, resume, contact card, and parts tray.
- `src/components/bench/objects/circuit-boards.tsx`: Discovery board and ADS1299/MMB0 stack.
- `src/components/bench/objects/debug-tools.tsx`: separate JTAG and logic analyzer illustrations.
- `src/components/bench/bench.css`: shared bench appearance and responsive layouts.
- `scripts/verify-bench.mjs`: browser checks and screenshots.

## Adjusting composition and camera

Edit `benchObjects` in `src/data/bench.ts`:

- `position.x/y` and `size.width/height`: desktop coordinates on the 2200 × 1400 desk plane.
- `rotation`: each object’s rotation.
- `focus.x/y`: point centered in the available inspection area.
- `focus.scale`: zoom multiplier relative to the fitted overview, limited to preserve visibility.
- `mobile`: independent guided coordinates and sizes; keyboard order follows these positions.

`BENCH.angle` is fixed at 28°. `BENCH.rotation` and `perspective` also drive the projection; if those two values change, update the matching desk CSS transform. The camera projects the focus point through the desk transform and then translates/scales its wrapper. ResizeObserver recalculates the fit. On mobile, scrolling centers the selected object in the actual available space above the panel.

## Shareable navigation

The overview uses `/` without a fragment. Inspection hashes: `#stm32`, `#board`, `#logic`, `#eeg`, `#waypoint`, `#debug`, `#experience`, `#about`, `#contact`, `#projects`, `#kinetic`, `#camera`, `#iot`, `#charging`, `#iguard`.

Selection uses `history.pushState` with the custom object ID; Next’s history bridge copies routing fields and synchronizes its URL. Native fragment entries with null history state are normalized with `router.replace`, so Back from a full project page restores the bench route. `popstate` and `hashchange` restore the inspection. Direct inspection hashes work; legacy `#bench` and unknown hashes normalize to the base URL without a fragment. Legacy homepage anchors for systems, additional projects, research/experience, and skills still open the appropriate bench area. The scope, development board, and logic analyzer have distinct summaries, metrics, capabilities, and Build views. `#stm32` opens analog capture, `#board` opens hardware, and `#logic` opens digital capture. `#kinetic` focuses its own physical display; the other additional projects focus the parts tray. Debugging stories link directly to named postmortem sections.

## Verification

Run `npm run check` for typecheck, lint, and production static export. Run `node scripts/verify-bench.mjs` with the static preview server running and installed Chrome started in headless mode with `--remote-debugging-port=9333` and a temporary profile. The verifier uses Node’s built-in WebSocket, verified with the workspace’s Node 24 runtime. `BENCH_ORIGIN` and `BENCH_DEBUGGER` can override the local endpoints.

The checker exercises the homepage, fixed angle, equipment distinctions, all project/hash states, architecture and evidence tabs, gallery navigation, skills/credentials, debugging, native keyboard/pointer input, browser history, focus restoration, desktop/laptop/tablet/mobile, reduced motion, `/portfolio` assets, resume, all project pages and their return links, removal of the old overview/chrome, retired prototype removal, and the non-JavaScript fallback. It also records runtime/hydration and failed-resource errors. Browser verification covers Chrome; other browsers have not been tested.

Final verification passed: typecheck, lint, production build, and the complete browser suite. Viewports checked were 1440 × 900, 1920 × 1080, 1024 × 768, 820 × 900, 390 × 844, and 320 × 700. Returning from a full case study, native hash navigation, visible return controls, selected-object placement, and keyboard focus availability passed. Chrome reported no runtime, hydration, or failed-resource errors.

## Captures

- [Desktop bench](desktop-bench.png)
- [1920px desktop](desktop-bench-1920.png)
- [STM32](stm32-inspection.png)
- [Development board](board-inspection.png)
- [Kinetic 7-segment display](kinetic-inspection.png)
- [Laptop / experience](experience-inspection.png)
- [Credentials](credentials-inspection.png)
- [EEG](eeg-inspection.png)
- [Waypoint](waypoint-inspection.png)
- [JTAG / debugging](debug-inspection.png)
- [Logic analyzer](logic-inspection.png)
- [Project library](projects-inspection.png)
- [Mobile bench](mobile-bench.png)
- [Mobile inspection](mobile-inspection.png)

Equipment remains illustrated; recorded signals are existing captures rather than live hardware simulations. The full project dossiers retain the technical material, measured results, limitations, and interactive demos as readable chapters. Media loads on demand in the inspection, while the landing scene only requests the existing analog workspace capture, cropped in CSS to its waveform area.

## Visual feedback refinements

The desk now has twelve objects, including a dedicated kinetic display illustrated from the real module?s printed frame, sliding segments, magnets, and screw-core coils. Laptop lid and keyboard base share their width. USB cables use equipment coordinates and rotations, remain attached on hover, and meet visible laptop ports. The JTAG ribbon keeps a consistent width through bends and enters its keyed connector; all eight analyzer leads meet their channel pins. Discovery/ADS1299 boards, compass housing, scope controls, paper, notebook, and tray have additional physical details.

The top-right location and dotted work-area boundary are removed. Captions are bounded to their objects and have reserved space; muted captions disappear during inspection. Experience entries consistently use prose without skill chips. Skills contain no project links. All six credentials use the same list layout.

Run `node scripts/verify-bench-visuals.mjs` for caption clearance, USB attachment on hover, and desktop/phone postmortem positioning, in addition to the existing bench and project checks. Browser scripts run sequentially because background Chrome tabs can defer lazy-loaded images.

Feedback verification passed: `npm run check`, the bench and project browser suites, and the visual geometry suite. Caption/USB checks covered 1440 × 900, 1920 × 1080, 1024 × 768, 820 × 900, 390 × 844, 320 × 700, and 844 × 390. All three postmortem links landed on their relevant content below navigation at desktop and phone sizes. The final overview and debugger/analyzer/laptop captures were refreshed after the cable routing changes.

The production cleanup removed duplicate preview routes, sample documentation/captures, unused UI components and their hook, obsolete styles/animations/data, and Firebase Studio scaffolding. The source import/export audit found no unreachable modules or unused exports. TypeScript now rejects unused locals and parameters. All page tabs use `Ziad's Portfolio`. The production build and all three browser verification suites passed after cleanup; retired preview routes return 404.
