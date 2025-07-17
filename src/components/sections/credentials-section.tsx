import Image from "next/image";

export interface Credential {
  title: string;
  issuer: string;
  date: string;
  icon: string;
}

export const credentials: Credential[] = [
//   {
//     title: "Generative AI for Software Developers",
//     issuer: "IBM",
//     date: "June 2025",
//     icon: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/credentials/ibm.png`,
//   },
//   {
//     title: "Applied Software Engineering Fundamentals",
//     issuer: "IBM",
//     date: "June 2025",
//     icon: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/credentials/ibm.png`,
//   },
  {
    title: "C Programming with Linux",
    issuer: "Dartmouth College",
    date: "June 2025",
    icon: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/credentials/Dartmouth.png`,
  },
  {
    title: "AI Developer Professional Certificate",
    issuer: "IBM",
    date: "May 2025",
    icon: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/credentials/ibm.png`,
  },
  {
    title: "Software Development Lifecycle",
    issuer: "University of Minnesota",
    date: "May 2025",
    icon: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/credentials/universityofminnesota.png`,
  },
  {
    title: "Embedded Systems Programming on ARM Cortex-M3/M4 Processor",
    issuer: "FastBit Academy",
    date: "March 2025",
    icon: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/credentials/fastbit.webp`,
  },
];

export default function CredentialsSection() {
  return (
    <section id="credentials" className="pt-8 md:pt-12 pb-16 md:pb-24 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-primary inline-block uppercase tracking-wider">
            Credentials
          </h2>
          <div className="w-20 h-px bg-foreground mx-auto mt-3"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {credentials.map((cred) => (
            <div key={cred.title} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <Image src={cred.icon} alt={cred.issuer} width={64} height={64} />
              </div>
              <h3 className="text-md font-semibold text-foreground uppercase tracking-wide">
                {cred.title}
              </h3>
              <p className="text-sm text-foreground/50">
                {cred.issuer} • {cred.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
