import { Hero } from '@/components/portfolio/hero';
import { ProofStrip } from '@/components/portfolio/proof-strip';
import { FeaturedProjects } from '@/components/portfolio/featured-projects';
import { DebugLog } from '@/components/portfolio/debug-log';
import { SkillsStack } from '@/components/portfolio/skills-stack';
import { ExperienceSection } from '@/components/portfolio/experience-section';
import { AboutSection } from '@/components/portfolio/about-section';

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <FeaturedProjects />
      <DebugLog />
      <SkillsStack />
      <ExperienceSection />
      <AboutSection />
    </>
  );
}
