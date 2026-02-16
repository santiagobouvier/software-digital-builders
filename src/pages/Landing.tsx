import { useState, useEffect } from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { SelfServiceSection } from "@/components/landing/SelfServiceSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { Starfield } from "@/components/landing/Starfield";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Preloader } from "@/components/landing/Preloader";

const Landing = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time for smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Preloader isLoading={isLoading} />
      
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
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Landing;
