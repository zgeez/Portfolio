import { eegChallenges, eegLayers, eegSite } from '@/data/eeg';
import { CaseSection, ProjectLayers } from '@/components/projects/project-chapter';
import { Bullets, Callout, DataTable, ExternalLink } from '@/components/portfolio/ui';
import {
  EegAcquisitionLayer,
  EegClassificationLayer,
  EegProcessingLayer,
  EegProductLayer,
  EegSystemLayer,
} from './eeg-layers';

export function EegCaseStudy() {
  return (
    <div className="dossier-case-body">
      <ProjectLayers
        layers={eegLayers}
        panels={[
          <EegProductLayer key="product" />,
          <EegSystemLayer key="system" />,
          <EegAcquisitionLayer key="acquisition" />,
          <EegProcessingLayer key="processing" />,
          <EegClassificationLayer key="classification" />,
        ]}
      />

      <CaseSection id="debugging" eyebrow="Failure analysis" title="Debugging">
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

      <CaseSection id="next" eyebrow="Limitations & future work" title="Limitations and next steps">
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
            {' '}My software/firmware work on the senior-design system continues as M.S. EEG research at NYIT;
            the measurements on this page describe the documented prototype.
          </p>
          <div className="mt-4">
            <ExternalLink href={eegSite}>zgeez.github.io/EEG-Based-Neurofeedback-System</ExternalLink>
          </div>
        </Callout>
      </CaseSection>
    </div>
  );
}
