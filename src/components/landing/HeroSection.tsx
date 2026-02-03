import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center pt-20 sm:pt-16 relative overflow-hidden"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(187 100% 50% / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(187 100% 50% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Perspective grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(180deg, transparent 0%, hsl(187 100% 50% / 0.2) 50%, transparent 100%)
            `,
            backgroundSize: '100% 4px',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Main central glow */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]"
        style={{
          background: 'radial-gradient(circle, hsl(187 100% 50% / 0.25) 0%, hsl(187 100% 50% / 0.08) 35%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top left accent glow */}
      <div 
        className="absolute -top-32 -left-32 w-[400px] h-[400px] opacity-40"
        style={{
          background: 'radial-gradient(circle, hsl(200 100% 60% / 0.3) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Top right accent glow */}
      <div 
        className="absolute -top-20 -right-20 w-[300px] h-[300px] opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(187 100% 50% / 0.4) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Animated floating orbs */}
      <div 
        className="absolute top-1/3 left-[10%] w-2 h-2 rounded-full bg-primary/50 animate-pulse"
        style={{ animationDuration: '3s' }}
      />
      <div 
        className="absolute top-1/2 right-[15%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
        style={{ animationDuration: '4s', animationDelay: '1s' }}
      />
      <div 
        className="absolute top-[40%] left-[20%] w-1 h-1 rounded-full bg-primary/30 animate-pulse"
        style={{ animationDuration: '5s', animationDelay: '2s' }}
      />

      {/* Decorative lines */}
      <div className="absolute top-[30%] left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-[60%] right-0 w-40 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-[45%] left-[5%] w-px h-20 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden sm:block" />
      <div className="absolute top-[35%] right-[8%] w-px h-16 bg-gradient-to-b from-transparent via-primary/15 to-transparent hidden sm:block" />

      {/* Corner accents */}
      <div className="absolute top-20 left-4 sm:left-8">
        <div className="w-8 h-8 border-l border-t border-primary/20 rounded-tl-lg" />
      </div>
      <div className="absolute top-20 right-4 sm:right-8">
        <div className="w-8 h-8 border-r border-t border-primary/20 rounded-tr-lg" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with better spacing */}
          <div className="mb-8 sm:mb-10">
            <Badge
              variant="outline"
              className="px-4 py-2 text-xs font-medium border-primary/40 text-primary bg-primary/5 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse" />
              Plataforma SaaS de Automatización
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Gestiona y monetiza tus{" "}
            <span className="text-primary relative">
              bots
              <span className="absolute -inset-1 bg-primary/20 blur-lg -z-10" />
            </span>{" "}
            desde una sola plataforma
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Control total de métricas, usuarios, suscripciones y facturación para automatizaciones de WhatsApp y Telegram.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[180px] h-12 text-base font-semibold shadow-glow">
              <Link to="/login">
                Entrar al sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px] h-12 text-base border-border/60 hover:border-primary/50 hover:bg-primary/5">
              <a href="mailto:contacto@digitalbuilders.net">
                Solicitar demo
              </a>
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 sm:mt-20 relative">
            {/* Glow behind preview */}
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-2xl" />
            
            <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-1.5 sm:p-2 shadow-2xl">
              <div className="bg-background/90 rounded-lg p-4 sm:p-6">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                    <div className="h-2 w-20 sm:w-24 bg-muted rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 sm:h-8 w-16 sm:w-20 bg-muted rounded" />
                    <div className="h-7 sm:h-8 w-7 sm:w-8 bg-muted rounded" />
                  </div>
                </div>
                
                {/* Mock KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {[
                    { label: "Mensajes", value: "12.4K", color: "primary" },
                    { label: "Leads", value: "847", color: "success" },
                    { label: "Handoffs", value: "156", color: "warning" },
                    { label: "MRR", value: "$2.4K", color: "primary" },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="bg-secondary/50 rounded-lg p-2.5 sm:p-4 border border-border/30"
                    >
                      <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                        {kpi.label}
                      </div>
                      <div className="text-sm sm:text-xl font-semibold text-foreground">
                        {kpi.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mock Chart Area */}
                <div className="h-24 sm:h-48 bg-secondary/30 rounded-lg flex items-end justify-around p-2 sm:p-4 gap-0.5 sm:gap-1 border border-border/20">
                  {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 70, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary/60 to-primary/30 rounded-t transition-all duration-500"
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
