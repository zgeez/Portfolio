import { asset } from '@/data/site';
import { CaseSection } from '@/components/projects/project-chapter';
import { Bullets, DataTable, PhoneShot } from '@/components/portfolio/ui';

const img = (name: string) => asset(`assets/iguard/${name}`);

const SCREENS = [
  ['home.jpeg', 'Home screen with a real-time incident feed', 'Home feed', 1964],
  ['report.jpeg', 'Incident reporting form with camera integration', 'Report incident', 1965],
  ['map.jpeg', 'Map view with incident markers', 'Map view', 1971],
  ['register.jpeg', 'Registration screen with business details form', 'Registration', 2302],
  ['payment.jpeg', 'Subscription plans and payment', 'Subscription', 1971],
  ['settings.jpeg', 'Settings and profile', 'Settings', 1969],
] as const;

export function IGuardCaseStudy() {
  return (
    <div className="dossier-case-body">

      <CaseSection id="overview" eyebrow="Overview" title="Community security, in real time">
        <div className="dossier-split"><div className="space-y-4 text-muted">
          <p>
            A cross-platform Flutter app for Android and iOS that lets businesses share security incidents, receive
            real-time alerts, and strengthen collective security through collaborative reporting and geo-fenced
            notifications.
          </p>
          <p>
            Powered by Firebase, it lets businesses report incidents instantly, receive alerts for nearby events, and
            access community-driven security information to help prevent theft.
          </p>
        </div><div className="flex justify-center"><PhoneShot src={img('home.jpeg')} alt="iGuard home screen with the incident feed" caption="Home feed — community incidents at a glance." width={921} height={1964} /></div></div>
      </CaseSection>

      <CaseSection id="features" eyebrow="Features" title="What it does">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Real-time alerts', ['Live feed of nearby incidents', 'Distance-based filtering', 'Geo-fenced push notifications', 'Severity color coding']],
            ['Incident reporting', ['Multi-image capture and upload', 'Automatic location tagging', 'Incident categories', 'Real-time database sync']],
            ['Map integration', ['Google Maps with custom markers', 'Incident clustering by location', 'Business location verification', 'Navigation and directions']],
            ['Subscriptions', ['Stripe payments', '7-day free trial', 'Feature-gated access', 'Subscription management portal']],
          ].map(([title, items]) => (
            <section key={title as string} className="panel p-5">
              <p className="label">{title as string}</p>
              <Bullets className="mt-3" items={items as string[]} />
            </section>
          ))}
        </div>
      </CaseSection>

      <CaseSection id="architecture" eyebrow="Architecture" title="Stack">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Frontend', ['Flutter (Android & iOS)', 'Riverpod state management', 'Go Router navigation', 'Google Maps SDK']],
            ['Backend', ['Firebase Firestore', 'Firebase Authentication', 'Firebase Storage', 'Cloud Functions']],
            ['Services', ['Stripe payments', 'FCM push notifications', 'Google Places API', 'Geolocator']],
          ].map(([title, items]) => (
            <section key={title as string} className="panel p-5">
              <p className="label">{title as string}</p>
              <Bullets className="mt-3" items={items as string[]} />
            </section>
          ))}
        </div>
      </CaseSection>

      <CaseSection id="screens" eyebrow="Screens" title="App interface">
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {SCREENS.map(([src, alt, cap, h]) => (
            <PhoneShot key={src} src={img(src)} alt={alt} caption={cap} width={src === 'register.jpeg' ? 1080 : 921} height={h} />
          ))}
        </div>
      </CaseSection>

      <CaseSection id="challenges" eyebrow="Challenges" title="Problems and fixes">
        <DataTable
          head={['Challenge', 'Approach']}
          rows={[
            ['Real-time data sync', 'Firestore listeners with Flutter streams for instant incident updates across connected devices'],
            ['Geo-fencing performance', 'Location queries using GeoPoint and Cloud Functions to limit battery drain while keeping accuracy'],
            ['Payment integration', 'Stripe with webhook handling in Cloud Functions for reliable subscription management'],
            ['Image uploads', 'Progressive image compression and Firebase Storage rules for efficient multi-image uploads'],
          ]}
        />
        <p className="mt-6 max-w-3xl text-muted">
          Tested with unit, widget, and integration tests. Next: machine learning for incident patterns, analytics
          dashboards, and integration with existing security systems.
        </p>
      </CaseSection>
    </div>
  );
}
