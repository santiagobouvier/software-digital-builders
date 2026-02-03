import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemsSection } from "@/components/landing/ProblemsSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { SelfServiceSection } from "@/components/landing/SelfServiceSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <ProblemsSection />
        <PlatformSection />
        <SelfServiceSection />
        <HowItWorksSection />
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
