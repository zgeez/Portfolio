import Header from '@/components/header';
import ProjectsSection from '@/components/sections/projects-section';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 md:py-16">
        <h1 className="text-5xl md:text-7xl font-black text-primary text-center my-8 md:my-12 uppercase tracking-wider">
          Ziad Ghanem
        </h1>
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
}
