import Image from 'next/image';
import React from 'react';

const IGuardIncidentReportingAppContent: React.FC = () => (
  <article className="container mx-auto px-4 py-0 prose lg:prose-lg">
    {/* ────────────── Header ────────────── */}
    <header className="mb-10">
      <p className="text-gray-600">
        A cross-platform mobile app built with Flutter for Android and iOS that empowers businesses to share security incidents, 
        receive real-time alerts, and enhance collective security through collaborative information sharing 
        and geo-fenced notifications.
      </p>
    </header>

    {/* ────────────── Hero / Demo Screenshots ────────────── */}
    <figure className="mb-12 flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/iguard/home.jpeg`}
        alt="iGuard app home screen showing incident feed and real-time alerts"
        width={400}
        height={800}
        className="rounded-xl shadow-lg max-w-sm"
        priority
      />
      <figcaption className="text-center text-sm mt-2">
        Home screen: Real-time incident feed with community-driven security alerts
      </figcaption>
    </figure>

    {/* ────────────── Context / Goal ────────────── */}
    <h2>Project Overview</h2>
    <p>
      iGuard addresses the critical need for real-time security information sharing among businesses. 
      Built with <strong>Flutter</strong> for cross-platform deployment on <strong>Android and iOS</strong> and powered by <strong>Firebase</strong>, the app enables businesses to 
      report incidents instantly, receive geo-fenced alerts, and access community-driven security intelligence 
      to prevent theft and enhance safety measures.
    </p>

    {/* ────────────── Key Features Grid ────────────── */}
    <div className="grid md:grid-cols-2 gap-6 my-10">
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="!m-0 text-lg font-semibold mb-3">Real-time Alert System</h3>
        <ul className="text-sm">
          <li> Live feed of nearby incidents</li>
          <li> Distance-based filtering</li>
          <li> Push notifications with geo-fencing</li>
          <li> Severity-based color coding</li>
        </ul>
      </section>
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="!m-0 text-lg font-semibold mb-3">Incident Reporting</h3>
        <ul className="text-sm ">
          <li> Multi-image capture and upload</li>
          <li> Auto-location tagging</li>
          <li> Incident categorization</li>
          <li> Real-time database sync</li>
        </ul>
      </section>
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="!m-0 text-lg font-semibold mb-3">Map Integration</h3>
        <ul className="text-sm ">
          <li> Google Maps with custom markers</li>
          <li> Incident clustering by location</li>
          <li> Business location verification</li>
          <li> Navigation and directions</li>
        </ul>
      </section>
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="!m-0 text-lg font-semibold mb-3">Subscription System</h3>
        <ul className="text-sm ">
          <li> Stripe payment integration</li>
          <li> 7-day free trial</li>
          <li> Feature-gated access control</li>
          <li> Subscription management portal</li>
        </ul>
      </section>
    </div>

    {/* ────────────── Tech Stack ────────────── */}
    <h2>Technical Architecture</h2>
    <div className="bg-blue-50 p-6 rounded-lg my-8">
      <h3 className="!mt-0 text-lg font-semibold mb-4">Technology Stack</h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Frontend</h4>
          <ul className="space-y-1">
            <li>• Flutter (Android & iOS)</li>
            <li>• Riverpod (State Management)</li>
            <li>• Go Router (Navigation)</li>
            <li>• Google Maps SDK</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Backend</h4>
          <ul className="">
            <li> Firebase Firestore</li>
            <li> Firebase Authentication</li>
            <li> Firebase Storage</li>
            <li> Cloud Functions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Services</h4>
          <ul className="">
            <li> Stripe (Payments)</li>
            <li> FCM (Push Notifications)</li>
            <li> Google Places API</li>
            <li> Geolocator</li>
          </ul>
        </div>
      </div>
    </div>

    {/* ────────────── App Screenshots Gallery ────────────── */}
    <h2>App Interface</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/iguard/register.jpeg`}
          alt="iGuard registration screen with user details form"
          width={300}
          height={600}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-xs text-center mt-2">Registration</figcaption>
      </figure>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/iguard/login.jpeg`}
          alt="Login and authentication screen"
          width={300}
          height={600}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-xs text-center mt-2">Authentication</figcaption>
      </figure>
      
      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/iguard/report.jpeg`}
          alt="Incident reporting form with camera integration"
          width={300}
          height={600}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-xs text-center mt-2">Report Incident</figcaption>
      </figure>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/iguard/map.jpeg`}
          alt="Map view with incident markers"
          width={300}
          height={600}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-xs text-center mt-2">Map View</figcaption>
      </figure>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/iguard/payment.jpeg`}
          alt="Subscription plans and payment processing"
          width={300}
          height={600}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-xs text-center mt-2">Payment & Subscription</figcaption>
      </figure>

      <figure className="rounded-lg shadow-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/iguard/settings.jpeg`}
          alt="App settings and user preferences"
          width={300}
          height={600}
          className="rounded-lg object-cover w-full"
        />
        <figcaption className="text-xs text-center mt-2">Settings & Profile</figcaption>
      </figure>
    </div>

    

    {/* ────────────── Key Challenges & Solutions ────────────── */}
    <h2>Technical Challenges & Solutions</h2>
    <ul>
      <li>
        <strong>Real-time Data Sync:</strong> Implemented Firestore listeners with Flutter streams 
        for instant incident updates across all connected devices.
      </li>
      <li>
        <strong>Geo-fencing Performance:</strong> Optimized location-based queries using GeoPoint 
        and cloud functions to minimize battery drain while maintaining accuracy.
      </li>
      <li>
        <strong>Payment Integration:</strong> Built secure Stripe integration with webhook handling 
        via Cloud Functions for reliable subscription management.
      </li>
      <li>
        <strong>Image Upload Optimization:</strong> Implemented progressive image compression 
        and Firebase Storage rules for efficient multi-image uploads.
      </li>
    </ul>

    {/* ────────────── Impact & Future Plans ────────────── */}
    <h2>Impact & Future Development</h2>
    <p>
      The app demonstrates expertise in modern mobile development practices, real-time systems, 
      and payment processing. Future enhancements include machine learning for incident pattern 
      recognition, advanced analytics dashboards, and integration with existing security systems.
    </p>

    {/* ────────────── Call-out Footer ────────────── */}
    <footer className="pt-12 border-t">
      <p className="text-sm text-gray-500">
        <em>Built with Flutter, Firebase, and comprehensive testing coverage including unit, 
        widget, and integration tests.</em>
      </p>
    </footer>
  </article>
);

export default IGuardIncidentReportingAppContent;
