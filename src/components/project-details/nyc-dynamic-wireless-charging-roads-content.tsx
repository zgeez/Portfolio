
import React from 'react';
import Image from 'next/image';

export default function NycDynamicWirelessChargingRoadsContent() {
  return (
    <>
      <h3>Role: Team Lead</h3>
      <p>Led a 3-member research team to design industry standard-compliant EV wireless charging lanes for NYC’s 42nd Street, delivering a tested simulation model for real-time urban charging feasibility.</p>
      <h3>Technical Stack &amp; Achievements:</h3>
      <ul>
        <li>Built a full-stack simulation pipeline: SUMO for traffic flow, MATLAB for energy transfer, and Python for cost modeling.</li>
        <li>Demonstrated 10% SOC gain per hour in stop-and-go traffic and 2x range increase at 60 mph through system simulation.</li>
      </ul>
      <h3>Recognition:</h3>
      <p>Project recognized as “Most Innovative Idea” by a panel of industry professionals at the 2025 NYIT UREP Symposium.</p>
      <div className="my-4 rounded shadow-md overflow-hidden">
        <Image
          src="https://placehold.co/600x350.png"
          alt="NYC Charging Lane Concept"
          width={600}
          height={350}
          className="w-full h-auto"
          data-ai-hint="urban charging concept"
        />
      </div>
    </>
  );
}
