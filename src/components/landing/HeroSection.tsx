import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden"
    >
      {/* Main glow effect - centered blob */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(187 100% 50% / 0.4) 0%, hsl(187 100% 50% / 0.1) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Secondary glow - top accent */}
      <div 
        className="absolute -top-20 left-1/3 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(200 100% 60% / 0.5) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-background opacity-20" />
      
      {/* Bottom fade to background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 text-xs font-medium border-primary/30 text-primary"
          >
            Plataforma SaaS de Automatización
          </Badge>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Gestiona y monetiza tus{" "}
            <span className="text-primary">bots</span>{" "}
            desde una sola plataforma
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Control total de métricas, usuarios, suscripciones y facturación para automatizaciones de WhatsApp y Telegram.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[180px]">
              <Link to="/login">
                Entrar al sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <a href="mailto:contacto@digitalbuilders.net">
                Solicitar demo
              </a>
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl" />
            <div className="relative bg-card border border-border/50 rounded-xl p-2 shadow-2xl">
              <div className="bg-background rounded-lg p-4 sm:p-6">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="h-2 w-24 bg-muted rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-muted rounded" />
                    <div className="h-8 w-8 bg-muted rounded" />
                  </div>
                </div>
                
                {/* Mock KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {[
                    { label: "Mensajes", value: "12.4K" },
                    { label: "Leads", value: "847" },
                    { label: "Handoffs", value: "156" },
                    { label: "MRR", value: "$2.4K" },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="bg-secondary/50 rounded-lg p-3 sm:p-4"
                    >
                      <div className="text-xs text-muted-foreground mb-1">
                        {kpi.label}
                      </div>
                      <div className="text-lg sm:text-xl font-semibold text-foreground">
                        {kpi.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mock Chart Area */}
                <div className="h-32 sm:h-48 bg-secondary/30 rounded-lg flex items-end justify-around p-4 gap-1">
                  {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 70, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/40 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
