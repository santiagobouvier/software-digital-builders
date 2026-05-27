import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const HeroSection = () => {
  const reduceMotion = useReducedMotion();

  // Faster animations
  const floatTransition = {
    duration: reduceMotion ? 4 : 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center pt-32 sm:pt-36 lg:pt-40 relative overflow-hidden"
    >
      {/* Subtle grid background - static, no performance impact */}
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

      {/* Main glow - floating effect (kept on mobile) */}
      <motion.div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] opacity-60"
        style={{
          background: 'radial-gradient(circle, hsl(187 100% 50% / 0.15) 0%, hsl(187 100% 50% / 0.03) 40%, transparent 70%)',
        }}
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{ ...floatTransition, duration: reduceMotion ? 5 : 4 }}
      />

      {/* Floating orbs - only on desktop */}
      {!reduceMotion && (
        <>
          <motion.div 
            className="absolute top-[15%] left-[10%] w-[200px] h-[200px] opacity-20"
            style={{
              background: 'radial-gradient(circle, hsl(260 80% 60% / 0.5) 0%, transparent 60%)',
            }}
            animate={{ 
              y: [0, -15, 0],
              x: [0, 8, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
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
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-[20%] left-[5%] w-[120px] h-[120px] opacity-10"
            style={{
              background: 'radial-gradient(circle, hsl(200 100% 60% / 0.5) 0%, transparent 60%)',
            }}
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Floating small particles - only on desktop */}
      {!reduceMotion && (
        <>
          <motion.div 
            className="absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-primary/60"
            animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[40%] right-[25%] w-2 h-2 rounded-full bg-primary/40"
            animate={{ y: [0, 10, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-[30%] left-[35%] w-1 h-1 rounded-full bg-white/50"
            animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[50%] left-[8%] w-1 h-1 rounded-full bg-primary/50"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[35%] right-[12%] w-1.5 h-1.5 rounded-full bg-white/30"
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Decorative lines - only on desktop */}
      {!reduceMotion && (
        <>
          <motion.div 
            className="absolute top-[30%] left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            animate={{ x: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[60%] right-0 w-40 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"
            animate={{ x: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Corner accents - static */}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            Soluciones{" "}
            <motion.span 
              className="text-primary relative inline-block"
              animate={reduceMotion ? {} : { y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              tecnológicas
              <span className="absolute -inset-1 bg-primary/20 rounded-lg -z-10" />
            </motion.span>{" "}
            para tu negocio
          </motion.h1>

          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            Páginas web, bots de atención automática y software a medida. Tecnología práctica que funciona.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
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

        </div>
      </div>
    </section>
  );
};
