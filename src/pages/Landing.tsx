import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { SelfServiceSection } from "@/components/landing/SelfServiceSection";
import { ClientsSection } from "@/components/landing/ClientsSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { Starfield } from "@/components/landing/Starfield";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Space starfield background */}
      <Starfield />
      
      <LandingNavbar />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <PlatformSection />
        <ServicesSection />
        <SecuritySection />
        <SelfServiceSection />
        <ClientsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
