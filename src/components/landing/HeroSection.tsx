import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center pt-24 sm:pt-20 relative overflow-hidden"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(187 100% 50% / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(187 100% 50% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main central glow - animated */}
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]"
        style={{
          background: 'radial-gradient(circle, hsl(187 100% 50% / 0.25) 0%, hsl(187 100% 50% / 0.08) 35%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top left accent glow */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.4 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute -top-32 -left-32 w-[400px] h-[400px]"
        style={{
          background: 'radial-gradient(circle, hsl(200 100% 60% / 0.3) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Top right accent glow */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.3 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute -top-20 -right-20 w-[300px] h-[300px]"
        style={{
          background: 'radial-gradient(circle, hsl(187 100% 50% / 0.4) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Animated floating orbs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute top-1/3 left-[10%] w-2 h-2 rounded-full bg-primary/50 animate-pulse"
        style={{ animationDuration: '3s' }}
      />
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute top-1/2 right-[15%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
        style={{ animationDuration: '4s', animationDelay: '1s' }}
      />

      {/* Decorative lines - animated */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute top-[30%] left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left" 
      />
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute top-[60%] right-0 w-40 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent origin-right" 
      />

      {/* Corner accents - animated */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute top-24 left-4 sm:left-8"
      >
        <div className="w-8 h-8 border-l border-t border-primary/20 rounded-tl-lg" />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute top-24 right-4 sm:right-8"
      >
        <div className="w-8 h-8 border-r border-t border-primary/20 rounded-tr-lg" />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            Soluciones{" "}
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-primary relative inline-block"
            >
              tecnológicas
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -inset-1 bg-primary/20 blur-lg -z-10" 
              />
            </motion.span>{" "}
            para tu negocio
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Páginas web, bots de atención automática y software a medida. Tecnología práctica que funciona.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="lg" className="min-w-[180px] h-12 text-base font-semibold shadow-glow">
                <Link to="/login">
                  Entrar al sistema
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button asChild variant="outline" size="lg" className="min-w-[180px] h-12 text-base border-border/60 hover:border-primary/50 hover:bg-primary/5">
                <a href="#contacto" onClick={(e) => { e.preventDefault(); document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Contactar
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mt-16 sm:mt-20 relative"
          >
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
                
                {/* Mock Service Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {[
                    { label: "Webs", value: "Rápidas" },
                    { label: "Bots", value: "24/7" },
                    { label: "Control", value: "Total" },
                    { label: "Soporte", value: "Activo" },
                  ].map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                      className="bg-secondary/50 rounded-lg p-2.5 sm:p-4 border border-border/30"
                    >
                      <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                        {kpi.label}
                      </div>
                      <div className="text-sm sm:text-xl font-semibold text-foreground">
                        {kpi.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mock Chart Area */}
                <div className="h-24 sm:h-48 bg-secondary/30 rounded-lg flex items-end justify-around p-2 sm:p-4 gap-0.5 sm:gap-1 border border-border/20">
                  {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 70, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 1.1 + i * 0.05, ease: "easeOut" }}
                      className="flex-1 bg-gradient-to-t from-primary/60 to-primary/30 rounded-t"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
