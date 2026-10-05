import type { Project } from '@/data/projects';
import { eegChallenges, eegHeroMetrics, eegLayers, eegSite } from '@/data/eeg';
import { AbstractionLens } from '@/components/portfolio/abstraction/abstraction-lens';
import { CaseSection, OnThisPage, ProjectHeader } from '@/components/portfolio/project-header';
import { Bullets, Callout, DataTable, ExternalLink } from '@/components/portfolio/ui';
import {
  EegAcquisitionLayer,
  EegClassificationLayer,
  EegProcessingLayer,
  EegProductLayer,
  EegSystemLayer,
} from './eeg-layers';

export function EegCaseStudy({ project }: { project: Project }) {
  return (
    <div className="space-y-14 md:space-y-20">
      <div className="space-y-8">
        <ProjectHeader project={project} metrics={eegHeroMetrics} />
        <OnThisPage
          items={[
            { id: 'layers', label: 'Product → Classification' },
            { id: 'debugging', label: 'Debugging' },
            { id: 'scope', label: 'Privacy & scope' },
            { id: 'next', label: 'Limitations & next' },
            { id: 'source', label: 'Project site' },
          ]}
        />
      </div>

      <section id="layers" aria-labelledby="layers-title" className="scroll-mt-24">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Abstraction lens</p>
          <h2 id="layers-title" className="section-title mt-2">
            From scalp to classifier
          </h2>
          <p className="mt-3 text-muted">Five layers, each closer to the signal. Stop at any depth.</p>
        </div>
        <AbstractionLens
          layers={eegLayers}
          panels={[
            <EegProductLayer key="product" />,
            <EegSystemLayer key="system" />,
            <EegAcquisitionLayer key="acquisition" />,
            <EegProcessingLayer key="processing" />,
            <EegClassificationLayer key="classification" />,
          ]}
        />
      </section>

      <CaseSection id="debugging" eyebrow="Debugging" title="What went wrong, and what is left">
        <DataTable head={['Issue', 'What went wrong', 'Fix', 'Remaining limitation']} rows={eegChallenges.map((r) => [...r])} />
      </CaseSection>

      <CaseSection id="scope" eyebrow="Privacy, safety & scope" title="Local-first, no diagnostic claims">
        <div className="grid gap-4 md:grid-cols-2">
          <Callout title="Local-first processing">
            Acquisition, markers, inference, and display all run locally. No cloud processing is required for the core
            workflow, which limits exposure of sensitive EEG and session data.
          </Callout>
          <Callout tone="warning" title="No diagnostic claims">
            The system does not diagnose or treat ADHD or any other condition. Its output is an engineering
            classification result, not a medical conclusion.
          </Callout>
          <Callout title="Data minimization">
            Only the data needed for testing, training, and validation is retained, using anonymous subject and session
            labels.
          </Callout>
          <Callout title="Supervised use only">
            Used under supervision within senior-design constraints. Any classroom or child-facing deployment would
            require consent procedures and institutional review.
          </Callout>
        </div>
      </CaseSection>

      <CaseSection id="next" eyebrow="Limitations & future work" title="Next">
        <Bullets
          items={[
            <><strong className="text-fg">Broader dataset:</strong> more subjects, to test cross-subject generalization.</>,
            <><strong className="text-fg">Live inference:</strong> integrate the latest exported model directly into the dashboard path.</>,
            <><strong className="text-fg">Artifact handling:</strong> stronger rejection for blink and motion transients.</>,
            <><strong className="text-fg">Setup ergonomics:</strong> better cap comfort, shorter time-to-first-signal.</>,
            <><strong className="text-fg">Validation:</strong> supervised, IRB-style usability testing before any classroom use.</>,
          ]}
        />
      </CaseSection>

      <CaseSection id="source" eyebrow="Project site" title="Full write-up and team credits">
        <Callout tone="accent">
          <p>
            Built with the TI ADS1299 analog front end, ESP32-S3 firmware, MATLAB, and an Electron/React dashboard by Team
            NeuroFocus (Senior Design II, NYIT). Full write-up, references, and team credits are on the project site.
          </p>
          <div className="mt-4">
            <ExternalLink href={eegSite}>zgeez.github.io/EEG-Based-Neurofeedback-System</ExternalLink>
          </div>
        </Callout>
      </CaseSection>
    </div>
  );
}
