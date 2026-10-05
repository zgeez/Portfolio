# Ziad Ghanem — Embedded & Firmware Portfolio

Static Next.js site deployed to GitHub Pages at <https://zgeez.github.io/portfolio/>.

The signature interaction is the **Abstraction Lens**: flagship projects can be peeled from
Product → System → Firmware → Hardware → Signals (layer names vary per project). The STM32,
EEG, Waypoint and kinetic-display pages have a lens; the rest are structured case studies.

## Commands

```bash
npm ci
npm run dev         # http://localhost:9002/portfolio/
npm run typecheck
npm run lint
npm run build       # static export to ./portfolio
npm start           # serve the export at http://localhost:4173/portfolio/
```

CI (`.github/workflows/deploy.yml`) runs typecheck, lint and build on every push and PR, and
deploys `./portfolio` to the `gh-pages` branch from `master`.

## Where things live

| Path | What |
| --- | --- |
| `src/data/site.ts` | Contact links, resume path, `asset()` helper for the `/portfolio` base path |
| `src/data/projects.ts` | Project registry shared by the homepage and `/projects/[slug]` |
| `src/data/stm32-msi.ts`, `eeg.ts`, `waypoint.ts` | Verified facts, diagrams and layer definitions for the flagship case studies |
| `src/data/profile.ts` | Experience, education, credentials, skills stack, debug stories |
| `src/components/portfolio/` | Homepage sections and shared UI |
| `src/components/portfolio/abstraction/` | Abstraction lens, dial control, probe diagram, per-project layers |
| `src/components/portfolio/case-studies/` | Case studies for projects without a lens |

## Content rules

- Every number on the site must come from a project write-up, repository, or the resume.
- Visualizations that are not data are labelled **Illustrative** / **Schematic**; replayed
  data is **Recorded**; the HardFault Easter egg is **Simulated**.
- Unverified details (DMA stream numbers, task priorities) are deliberately omitted.

## Media

Large GIFs were converted to MP4/WebM with posters (`preload="none"`). Card images use WebP
thumbnails in `public/assets/thumbs/`.
