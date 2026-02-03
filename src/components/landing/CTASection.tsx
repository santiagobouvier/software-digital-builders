import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-24 sm:py-36 relative overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/10 to-background" />
      
      {/* Large central glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px]"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.15) 0%, hsl(187 100% 50% / 0.05) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Animated grid */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(187 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(187 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden sm:block" />
      <div className="absolute top-1/3 right-[5%] w-px h-24 bg-gradient-to-b from-transparent via-primary/15 to-transparent hidden sm:block" />
      <div className="absolute top-1/2 left-[15%] w-20 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden sm:block" />
      <div className="absolute top-[40%] right-[12%] w-16 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent hidden sm:block" />

      {/* Floating orbs */}
      <div 
        className="absolute top-1/4 left-[20%] w-2 h-2 rounded-full bg-primary/40 animate-pulse"
        style={{ animationDuration: '3s' }}
      />
      <div 
        className="absolute top-2/3 right-[25%] w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse"
        style={{ animationDuration: '4s', animationDelay: '1s' }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Comienza a gestionar tus bots{" "}
            <span className="text-primary relative inline-block">
              hoy
              <span className="absolute -inset-2 bg-primary/20 blur-lg -z-10 rounded-lg" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Control total sobre métricas, usuarios y facturación desde una única plataforma.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[180px] h-12 text-base font-semibold shadow-glow hover:shadow-glow-lg transition-shadow">
              <Link to="/login">
                Entrar al sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px] h-12 text-base border-border/60 hover:border-primary/50 hover:bg-primary/5">
              <a href="mailto:contacto@digitalbuilders.net">
                Contactar
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
