import { asset } from '@/data/site';
import { CaseSection } from '@/components/projects/project-chapter';
import { Bullets, Callout, DataTable, Figure } from '@/components/portfolio/ui';

const img = (name: string) => asset(`assets/dwpt/${name}`);

const PIPELINE = [
  { stage: 'SUMO', detail: 'per-vehicle speed traces' },
  { stage: 'MATLAB', detail: 'SAE coil equations → kW pickup' },
  { stage: 'Python', detail: 'lifecycle cost & sensitivity' },
];

export function WirelessChargingCaseStudy() {
  return (
    <div className="dossier-case-body">

      <CaseSection id="problem" eyebrow="Problem & goal" title="Can 42nd Street charge cars in motion?">
        <div className="dossier-split">
          <div className="space-y-4 text-muted">
            <p>
              Simulated SAE J2954 lanes on Midtown’s busiest crosstown artery. 42nd St averages{' '}
              <strong className="text-fg">≈70k vehicles/day</strong> crawling at <strong className="text-fg">≈3 mph</strong>:
              dwell-time-rich conditions for in-motion charging.
            </p>
            <Bullets
              items={[
                'How much state of charge can drivers regain per urban trip?',
                'Do 11 kW (WPT-3) or 22 kW (WPT-4) coils make economic sense at city scale?',
              ]}
            />
            <p>
              <span className="label mr-2">Role</span>
              Team lead on a three-member research group: scoped the study, built the simulation pipeline, and presented
              findings to the NYIT UREP judges.
            </p>
          </div>
          <figure className="panel overflow-hidden">
            <video controls muted loop playsInline preload="none" poster={img('main-poster.jpg')} className="h-auto w-full" aria-label="SUMO traffic simulation at 5th Avenue and 42nd Street">
              <source src={img('main.webm')} type="video/webm" />
              <source src={img('main.mp4')} type="video/mp4" />
            </video>
            <figcaption className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 text-sm text-muted">
              SUMO simulation at 5th Ave &amp; 42nd St.
              <span className="tag-recorded shrink-0">Recorded run</span>
            </figcaption>
          </figure>
        </div>
      </CaseSection>

      <CaseSection id="method" eyebrow="Method" title="Traffic model → power model → cost model">
        <ol className="mb-6 flex flex-wrap items-stretch gap-2" aria-label="Simulation pipeline">
          {PIPELINE.map((s, i) => (
            <li key={s.stage} className="flex items-center gap-2">
              <div className="rounded-md border border-line bg-panel px-3 py-2">
                <p className="font-mono text-xs text-fg">{s.stage}</p>
                <p className="font-mono text-[0.68rem] text-dim">{s.detail}</p>
              </div>
              {i < PIPELINE.length - 1 && (
                <span aria-hidden className="text-accent">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <div className="grid gap-4 md:grid-cols-2">
          <Figure src={img('block_diagram.png')} alt="Poster overview: coil layout and SUMO heat map of 42nd St" width={1268} height={482} caption="Study overview." imgClassName="bg-white" />
          <Figure src={img('sumo_midtown_map.webp')} alt="SUMO traffic network for Midtown Manhattan" width={1600} height={1617} caption="SUMO network, Midtown 42nd St." />
        </div>
      </CaseSection>

      <CaseSection id="results" eyebrow="Results" title="Per-trip energy and cost">
        <DataTable
          head={['Per 5–20 mi trip', 'WPT-3 (11 kW)', 'WPT-4 (22 kW)']}
          rows={[
            ['Energy gained', <span key="a" className="font-mono">+3.3 – 8.8 kWh</span>, <span key="b" className="font-mono text-accent">+8.4 – 22.7 kWh</span>],
            ['SOC improvement', <span key="c" className="font-mono">4 – 14%</span>, <span key="d" className="font-mono text-accent">9 – 28%</span>],
            ['CapEx per lane-mile', <span key="e" className="font-mono">dual-pad baseline</span>, <span key="f" className="font-mono text-accent">≈35% lower</span>],
          ]}
        />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Figure src={img('matlab_power_curve.png')} alt="MATLAB heat map of net battery change for an 11 kW WPT-3 lane" width={569} height={368} caption="Net battery change, 11 kW WPT-3." imgClassName="bg-white" />
          <Figure src={img('sumo_sim_result.png')} alt="SUMO simulation result for Midtown 42nd St" width={576} height={470} caption="SUMO simulation result, 42nd St." imgClassName="bg-white" />
        </div>
      </CaseSection>

      <CaseSection id="validation" eyebrow="Validation" title="Checked against field data">
        <Callout tone="accent">
          The main challenge was reconciling field-tested coil efficiencies (Electreon Gotland, Purdue I-65) with simulated
          NYC traffic. After tuning, the pickup curves match published data within <strong className="text-fg">±5%</strong>.
        </Callout>
      </CaseSection>

      <CaseSection id="impact" eyebrow="Impact & next" title="Recognition">
        <div className="grid gap-4 md:grid-cols-2">
          <Callout title="Impact">
            <Bullets
              items={[
                'Awarded “Most Innovative Idea” at the 2025 NYIT UREP Symposium',
                'Cost model adopted by the NYIT Smart Cities cluster for broader DWPT feasibility studies',
                'Insights feeding a routing-app prototype that predicts trip-level SOC gains from live traffic',
              ]}
            />
          </Callout>
          <Callout title="Next">
            Coil-encapsulation durability in salted winter conditions, and API integration of live DWPT-lane data into
            mapping services.
          </Callout>
        </div>
      </CaseSection>
    </div>
  );
}
