import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ProductsSection } from "@/components/landing/ProductsSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { SelfServiceSection } from "@/components/landing/SelfServiceSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { Starfield } from "@/components/landing/Starfield";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Space starfield background */}
      <Starfield />
      
      <LandingNavbar />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
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
