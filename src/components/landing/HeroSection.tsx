import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center pt-24 sm:pt-20 relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(187 100% 50% / 0.2) 1px, transparent 1px),
            linear-gradient(90deg, hsl(187 100% 50% / 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main glow - floating effect */}
      <motion.div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] opacity-60"
        style={{
          background: 'radial-gradient(circle, hsl(187 100% 50% / 0.15) 0%, hsl(187 100% 50% / 0.03) 40%, transparent 70%)',
        }}
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      {/* Floating orbs - space feel */}
      <motion.div 
        className="absolute top-[15%] left-[10%] w-[200px] h-[200px] opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(260 80% 60% / 0.5) 0%, transparent 60%)',
        }}
        animate={{ 
          y: [0, -15, 0],
          x: [0, 8, 0],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute top-[60%] right-[5%] w-[150px] h-[150px] opacity-15"
        style={{
          background: 'radial-gradient(circle, hsl(187 100% 50% / 0.6) 0%, transparent 60%)',
        }}
        animate={{ 
          y: [0, 12, 0],
          x: [0, -6, 0],
        }}
        transition={{ 
          duration: 9, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div 
        className="absolute bottom-[20%] left-[5%] w-[120px] h-[120px] opacity-10"
        style={{
          background: 'radial-gradient(circle, hsl(200 100% 60% / 0.5) 0%, transparent 60%)',
        }}
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating small particles */}
      <motion.div 
        className="absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-primary/60"
        animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-[40%] right-[25%] w-2 h-2 rounded-full bg-primary/40"
        animate={{ y: [0, 10, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute bottom-[30%] left-[35%] w-1 h-1 rounded-full bg-white/50"
        animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div 
        className="absolute top-[50%] left-[8%] w-1 h-1 rounded-full bg-primary/50"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="absolute top-[35%] right-[12%] w-1.5 h-1.5 rounded-full bg-white/30"
        animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      {/* Decorative lines */}
      <motion.div 
        className="absolute top-[30%] left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        animate={{ x: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-[60%] right-0 w-40 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"
        animate={{ x: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Corner accents */}
      <div className="absolute top-24 left-4 sm:left-8">
        <div className="w-8 h-8 border-l border-t border-primary/20 rounded-tl-lg" />
      </div>
      <div className="absolute top-24 right-4 sm:right-8">
        <div className="w-8 h-8 border-r border-t border-primary/20 rounded-tr-lg" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          <motion.h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Soluciones{" "}
            <motion.span 
              className="text-primary relative inline-block"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              tecnológicas
              <span className="absolute -inset-1 bg-primary/20 rounded-lg -z-10" />
            </motion.span>{" "}
            para tu negocio
          </motion.h1>

          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            Páginas web, bots de atención automática y software a medida. Tecnología práctica que funciona.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <Button asChild size="lg" className="min-w-[180px] h-12 text-base font-semibold shadow-glow hover-scale">
              <Link to="/login">
                Entrar al sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px] h-12 text-base border-border/60 hover:border-primary/50 hover:bg-primary/5 hover-scale">
              <a href="#contacto" onClick={(e) => { e.preventDefault(); document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Contactar
              </a>
            </Button>
          </motion.div>

          {/* Dashboard Preview - floating effect */}
          <motion.div 
            className="mt-16 sm:mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl" />
              
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
                  
                  {/* Mock Service Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    {[
                      { label: "Webs", value: "Rápidas" },
                      { label: "Bots", value: "24/7" },
                      { label: "Control", value: "Total" },
                      { label: "Soporte", value: "Activo" },
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
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary/60 to-primary/30 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.05, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
