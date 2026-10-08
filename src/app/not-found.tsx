import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <p className="eyebrow">404 / Page unavailable</p>
      <h1 className="text-4xl font-medium tracking-tight text-fg sm:text-5xl">Page not found.</h1>
      <p className="max-w-md text-base leading-relaxed text-muted">
        This link may be out of date. Return to the workbench to explore the projects.
      </p>
      <Link href="/" className="link-accent inline-flex min-h-11 w-fit items-center gap-3 text-sm">
        <ArrowLeft size={18} aria-hidden /> Back to workbench
      </Link>
    </section>
  );
}
