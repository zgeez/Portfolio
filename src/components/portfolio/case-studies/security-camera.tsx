import type { Project } from '@/data/projects';
import { asset } from '@/data/site';
import { CaseSection, OnThisPage, ProjectHeader } from '@/components/portfolio/project-header';
import { Bullets, Callout, Figure } from '@/components/portfolio/ui';

const img = (name: string) => asset(`assets/security-cam/${name}`);

const METRICS = [
  { value: '3 → 30', label: 'FPS on CPU', detail: 'after optimization' },
  { value: '33 ms', label: 'inference time', detail: 'from 330 ms · INT8' },
  { value: '−70%', label: 'idle CPU', detail: 'PIR motion gating' },
  { value: '95%', label: 'person-detection accuracy kept', detail: 'after INT8' },
];

const PIPELINE = [
  { stage: 'PIR sensor', detail: 'first-stage motion' },
  { stage: 'Motion trigger', detail: 'wakes inference' },
  { stage: 'YOLOv11n', detail: 'NCNN · INT8' },
  { stage: 'Event logic', detail: 'person verified?' },
  { stage: 'Recorder', detail: 'AVI → MP4 via FFmpeg' },
  { stage: 'Flask dashboard', detail: 'MJPEG live stream' },
];

export function SecurityCameraCaseStudy({ project }: { project: Project }) {
  return (
    <div className="space-y-14 md:space-y-20">
      <div className="space-y-8">
        <ProjectHeader project={project} metrics={METRICS} />
        <OnThisPage
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'architecture', label: 'Architecture' },
            { id: 'implementation', label: 'Implementation' },
            { id: 'optimizations', label: 'Optimizations' },
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'results', label: 'Results & next' },
          ]}
        />
      </div>

      <CaseSection id="overview" eyebrow="Overview" title="Edge AI on a Raspberry Pi 5">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-start">
          <div className="space-y-4 text-muted">
            <p>
              A complete edge-AI security system that combines PIR sensor triggering with YOLOv11n object detection,
              optimized for Raspberry Pi 5 to reach real-time person detection, with event recording and a web dashboard
              for monitoring and control.
            </p>
            <p>
              Real-time performance comes from an INT8-quantized YOLOv11n on the NCNN backend, motion gating so inference
              runs only when something moves, and a multi-threaded architecture that keeps capture, inference and web
              serving out of each other’s way.
            </p>
          </div>
          <Figure src={img('main.jpg')} alt="Raspberry Pi 5 with Pi Camera Module and PIR sensor" width={1536} height={2048} caption="Raspberry Pi 5 with Pi Camera Module." className="mx-auto max-w-xs" />
        </div>
      </CaseSection>

      <CaseSection id="architecture" eyebrow="Architecture" title="Two-stage detection">
        <ol className="mb-6 flex flex-wrap items-stretch gap-2" aria-label="Detection pipeline">
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
        <Figure
          src={img('architecture_diagram.png')}
          alt="Architecture diagram: Pi camera and PIR sensor feed camera capture and motion trigger, YOLOv11n detection and event logic, an FFmpeg recorder to event storage, and a Flask dashboard live stream to the browser"
          width={1387}
          height={363}
          caption="Multi-threaded architecture with separate live-feed and recording pipelines."
          imgClassName="bg-white"
        />
      </CaseSection>

      <CaseSection id="implementation" eyebrow="Implementation" title="What runs where">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Real-time detection', ['YOLOv11n, NCNN backend, INT8', '3 FPS → 30 FPS on CPU', 'Motion-gated processing', 'Person detection with confidence scores']],
            ['Motion & events', ['PIR sensor as first stage', 'YOLO verification before alarms', 'Automatic event recording (AVI → MP4)', 'Background FFmpeg conversion']],
            ['Multi-threading', ['Separate live-feed and recording pipelines', 'MJPEG streaming over Flask', 'Asynchronous video processing', 'Balanced CPU load']],
            ['Monitoring', ['Real-time FPS and CPU', 'Inference latency tracking', 'Detection-rate analytics', 'JSON API endpoints for metrics']],
          ].map(([title, items]) => (
            <section key={title as string} className="panel p-5">
              <p className="label">{title as string}</p>
              <Bullets className="mt-3" items={items as string[]} />
            </section>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ['Hardware', 'Raspberry Pi 5 · Pi Camera Module · PIR motion sensor'],
            ['AI / vision', 'YOLOv11n (NCNN) · INT8 quantization · OpenCV'],
            ['Web', 'Flask (Python) · HTML/CSS/JS · FFmpeg'],
          ].map(([k, v]) => (
            <p key={k} className="text-sm text-muted">
              <span className="label mr-2">{k}</span>
              {v}
            </p>
          ))}
        </div>
      </CaseSection>

      <CaseSection id="optimizations" eyebrow="Optimizations" title="From 3 to 30 FPS">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-start">
          <Bullets
            items={[
              <><strong className="text-fg">Motion gating:</strong> the PIR sensor triggers YOLO only when motion is detected, reducing CPU usage by 70% during idle periods.</>,
              <><strong className="text-fg">INT8 quantization:</strong> inference time from 330 ms to 33 ms while keeping 95% accuracy on person detection.</>,
              <><strong className="text-fg">Multi-threading:</strong> video capture, inference and web serving in independent threads.</>,
              <><strong className="text-fg">Asynchronous processing:</strong> background video conversion never blocks the real-time detection pipeline.</>,
            ]}
          />
          <Figure src={img('performance_comparison.png')} alt="Before-and-after performance metrics for the optimizations" width={1368} height={1485} caption="Before vs. after optimization." />
        </div>
      </CaseSection>

      <CaseSection id="dashboard" eyebrow="Dashboard" title="Monitoring and control">
        <Figure src={img('dashboard.webp')} alt="Main dashboard with metrics and controls" width={1600} height={1116} caption="Main dashboard." />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Figure src={img('live_camera_feed.webp')} alt="Live camera feed with detection overlay" width={1140} height={757} caption="Live feed with detection overlay." />
          <Figure src={img('latest_detection.png')} alt="Latest detection playback with metadata" width={1136} height={753} caption="Detection playback with metadata." />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="panel p-5">
            <p className="label">Live monitoring</p>
            <Bullets className="mt-3" items={['Camera feed with overlays', 'Detection status indicators', 'System health monitoring', 'Responsive on mobile and desktop']} />
          </section>
          <section className="panel p-5">
            <p className="label">Control panel</p>
            <Bullets className="mt-3" items={['PIR enable/disable toggle', 'Light/dark theme', 'Fullscreen camera view', 'Recording controls']} />
          </section>
        </div>
      </CaseSection>

      <CaseSection id="results" eyebrow="Results & next" title="Outcome">
        <div className="grid gap-4 md:grid-cols-2">
          <Callout tone="accent" title="Achievements">
            <Bullets
              items={[
                '30 FPS real-time detection on Raspberry Pi 5',
                '70% lower idle CPU through motion gating',
                'No false alarms observed with the two-stage PIR + YOLO design',
                'Web dashboard with real-time monitoring',
              ]}
            />
          </Callout>
          <Callout title="Next">
            <Bullets
              items={[
                'Multiple camera nodes with centralized monitoring',
                'Cloud storage and remote access',
                'Behavioral analysis and anomaly detection',
                'Companion mobile app for alerts',
              ]}
            />
          </Callout>
        </div>
      </CaseSection>
    </div>
  );
}
