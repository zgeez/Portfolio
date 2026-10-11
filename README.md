# Ziad Ghanem — Embedded & Firmware Portfolio

Static Next.js site deployed to GitHub Pages at <https://ziadg.com/>.
The custom domain serves the site at `/`; generated assets and routes use that root path.
`public/CNAME` preserves the custom domain in each deployment.

The homepage is an angled **Embedded Lab Bench**. Physical equipment opens project,
debugging, experience, and profile inspections. All eight projects use the shared
**project dossier**: an angled artifact header, a chapter rail, engineering narrative,
real evidence, and interactive technical demonstrations.

The production source contains the workbench and eight project dossiers. See the
[bench guide](docs/bench/README.md) and [project dossier guide](docs/projects/README.md).

## Commands

```bash
npm ci
npm run dev         # http://localhost:9002/
npm run typecheck
npm run lint
npm run build       # static export to ./portfolio
npm start           # serve the export at http://localhost:4173/
```

CI (`.github/workflows/deploy.yml`) runs typecheck, lint and build on every push and PR, and
deploys `./portfolio` to the `gh-pages` branch from `master`.

## Where things live

| Path | What |
| --- | --- |
| `src/data/site.ts` | Contact links, resume path, canonical domain, and public `asset()` helper |
| `src/data/projects.ts` | Project registry shared by the homepage and `/projects/[slug]` |
| `src/data/stm32-msi.ts`, `eeg.ts`, `waypoint.ts` | Verified facts, diagrams and layer definitions for the flagship case studies |
| `src/data/profile.ts` | Experience, education, credentials, skills stack, debug stories |
| `src/components/bench/` | Angled workbench, equipment, inspections, and dock |
| `src/data/bench.ts`, `bench-content.ts` | Bench composition, inspection targets, real media |
| `src/data/project-dossiers.ts` | Project-specific titles, artifacts, chapters, and existing headline metrics |
| `src/components/projects/` | Shared dossier layout, chapters, artifact illustrations, and native evidence expansion |
| `src/components/portfolio/` | Technical document content and shared evidence UI |
| `src/components/portfolio/abstraction/` | Probe diagrams, technical chapter content, and project-specific interactive demos |
| `src/components/portfolio/case-studies/` | Case studies for projects without a lens |

## Content rules

- Every number on the site must come from a project write-up, repository, or the resume.
- Visualizations that are not data are labelled **Illustrative** / **Schematic**; replayed
  data is **Recorded**; the HardFault Easter egg is **Simulated**.
- Unverified details (DMA stream numbers, task priorities) are deliberately omitted.

## Media

Large GIFs were converted to MP4/WebM with posters (`preload="none"`). Card images use WebP
thumbnails in `public/assets/thumbs/`.

## Source maintenance

The browser tab title is `Ziad's Portfolio` on every page. Retired preview routes, sample captures, unused UI scaffolding, and unused dependencies have been removed. TypeScript rejects unused locals and parameters. Browser verification scripts cover the workbench, dossiers, and visual geometry; run them sequentially against the local static preview with headless Chrome on port 9333.
