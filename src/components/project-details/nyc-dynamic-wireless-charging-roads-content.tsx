
import React from 'react';
import Image from 'next/image';

export default function DynamicWirelessChargingRoads42ndSt() {
  return (
    <article className="prose prose-lg max-w-none">
      {/* ─────────────────────────────── Hero ─────────────────────────────── */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">
          Dynamic Wireless Charging Road — NYC Pilot
        </h1>
        <p className="italic">
          Simulated SAE-J2954 lanes on Midtown’s busiest crosstown artery, showing that&nbsp;
          <strong>&lt; 3 mi</strong> of equipped roadway can offset an EV’s entire daily energy use.
        </p>

        {/* Immediate visual context */}
        <figure className="my-4 rounded shadow overflow-hidden">
          <Image
            src="/assets/dwpt/block_diagram.png"
            alt="Poster overview: coil layout + SUMO heat-map of 42 nd St"
            width={900}
            height={500}
            className="w-full h-auto max-w-2xl mx-auto"
          />
        </figure>
      </header>

      {/* ─────────────────────────────── Role ─────────────────────────────── */}
      <h2>Role</h2>
      <p>
        <strong>Team Lead</strong> on a three-member research group — scoped the study, built the simulation
        pipeline, and presented findings to UREP (Undergraduate Research and Entrepreneurship Program) judges.
      </p>

      {/* ─────────────────────── Problem / Goal (with visual) ─────────────────────── */}
      <h2>Problem &amp; Goal</h2>
      <p>
        42nd St averages <strong>≈ 70 k</strong> vehicles/day crawling at <strong>≈ 3 mph</strong> — ideal
        “dwell-time rich” conditions for in-motion charging. We asked:
      </p>
      <ul>
        <li>How much <strong>SOC</strong> can drivers regain per urban trip?</li>
        <li>Do 11 kW (WPT-3) or 22 kW (WPT-4) coils make economic sense at city scale?</li>
      </ul>

      <figure className="my-6 rounded shadow overflow-hidden">
        <Image
          src="/assets/dwpt/sumo_midtown_map.png"
          alt="SUMO traffic density heat-map for Midtown Manhattan"
          width={600}
          height={300}
          className="w-full h-auto max-w-xl mx-auto"
        />
        <figcaption className="text-sm text-center mt-2">
          SUMO simulation Midtown 42nd St Map.
        </figcaption>
      </figure>

      {/* ─────────────────────────────── Stack ─────────────────────────────── */}
      <h2>Stack &amp; Workflow</h2>
      <ul>
        <li><strong>SUMO</strong> — microscopic traffic model of Midtown; outputs per-vehicle speed traces.</li>
        <li>
          <strong>MATLAB</strong> — implements SAE coil equations &amp; efficiency curves to compute
          instantaneous kW pickup.
        </li>
        <li>
          <strong>Python (Numpy + Pandas)</strong> — lifecycle-cost model and sensitivity analyses.
        </li>
      </ul>

      {/* ─────────────────────────────── Results ─────────────────────────────── */}
      <h2>Key Results</h2>
      <ul>
        <li>
          <strong>Energy gain per 5 – 20 mi trip:</strong> +3.3 – 8.8 kWh (WPT-3) / +8.4 – 22.7 kWh (WPT-4)
        </li>
        <li>
          <strong>SOC improvement:</strong> 4 – 14 % (WPT-3) / 9 – 28 % (WPT-4)
        </li>
        <li>
          <strong>CapEx per lane-mile:</strong> WPT-4 lowers cost by <em>≈ 35 %</em> versus dual-pad WPT-3.
        </li>
      </ul>

      <figure className="my-6 rounded shadow overflow-hidden">
        <Image
          src="/assets/dwpt/matlab_power_curve.png"
          alt="MATLAB plot: instantaneous power pickup along 42 nd St"
          width={600}
          height={300}
          className="w-full h-auto max-w-xl mx-auto"
        />
        <figcaption className="text-sm text-center mt-2">
          Heat-map of Net battery change for an 11 kW WPT-3
        </figcaption>
      </figure>

      <figure className="my-6 rounded shadow overflow-hidden">
        <Image
          src="/assets/dwpt/sumo_sim_result.png"
          alt="MATLAB plot: instantaneous power pickup along 42 nd St"
          width={600}
          height={300}
          className="w-full h-auto max-w-xl mx-auto"
        />
        <figcaption className="text-sm text-center mt-2">
          SUMO Simulation Result for Midtown 42nd St NYC
        </figcaption>
      </figure>

      {/* ─────────────────────── Technical Hurdles / Validation ─────────────────────── */}
      <h2>Technical Hurdles &amp; Validation</h2>
      <p>
        The main challenge was reconciling <em>field-tested</em> coil efficiencies (Electreon Gotland,
        Purdue I-65) with simulated NYC traffic. After tuning, our pickup curves match published data
        within <strong>± 5 %</strong>, giving confidence that projections reflect real-world performance.
      </p>

      {/* ─────────────────────────────── Impact ─────────────────────────────── */}
      <h2>Impact &amp; Recognition</h2>
      <ul>
        <li>
          Awarded <strong>“Most Innovative Idea”</strong> at the 2025 NYIT UREP Symposium.
        </li>
        <li>
          Cost model adopted by NYIT Smart Cities cluster for broader DWPT feasibility studies.
        </li>
        <li>
          Insights feeding a routing-app prototype predicting trip-level SOC gains using live traffic.
        </li>
      </ul>

      {/* ─────────────────────────────── Next Steps ─────────────────────────────── */}
      <h2>Next Steps</h2>
      <p>
        Ongoing research targets coil-encapsulation durability in salted winter conditions and API
        integration of live DWPT-lane data into mapping services.
      </p>
    </article>
  );
}
