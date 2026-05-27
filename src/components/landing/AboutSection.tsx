import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Logo } from "@/components/Logo";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const AboutSection = () => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Only apply scroll transforms on desktop
  const logoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [30, -30]);
  const logoScale = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [0.9, 1, 0.95]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduceMotion ? 0 : 0.05, delayChildren: 0 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, type: "tween" as const, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="nosotros"
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Background effects - static */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]"
          style={{
            background:
              "radial-gradient(circle, hsl(187 100% 50% / 0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Decorative corner lines - only on desktop */}
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute top-16 left-8 w-20 h-20 border-l border-t border-primary/20 rounded-tl-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="absolute bottom-16 right-8 w-20 h-20 border-r border-b border-primary/20 rounded-br-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Floating Logo */}
            <motion.div
              className="relative flex items-center justify-center order-1 lg:order-1"
              style={{ y: logoY, scale: logoScale }}
            >
              {/* Glow behind logo - only animate on desktop */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={reduceMotion ? {} : {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div
                  className="w-48 h-48 sm:w-64 sm:h-64 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, hsl(187 100% 50% / 0.2) 0%, transparent 70%)",
                  }}
                />
              </motion.div>

              {/* Orbiting particles - only on desktop */}
              {!reduceMotion && (
                <>
                  <motion.div
                    className="absolute w-2 h-2 rounded-full bg-primary/60"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ transformOrigin: "80px center" }}
                  />
                  <motion.div
                    className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ transformOrigin: "100px center" }}
                  />
                </>
              )}

              {/* Logo with floating effect (kept on mobile) */}
              <motion.div
                className="relative"
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Logo size="lg" className="h-28 sm:h-40 opacity-90 drop-shadow-2xl" />
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="order-2 lg:order-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.span
                className="inline-block text-primary text-sm font-medium tracking-wider uppercase mb-4"
                variants={itemVariants}
              >
                Sobre Nosotros
              </motion.span>

              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                variants={itemVariants}
              >
                Tu presencia digital,{" "}
                <span className="text-primary">en buenas manos</span>
              </motion.h2>

              <motion.p
                className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8"
                variants={itemVariants}
              >
                Creamos soluciones digitales a medida para negocios que quieren
                destacar. Desde páginas web hasta sistemas personalizados,
                transformamos ideas en herramientas que funcionan.
              </motion.p>

              {/* Vision card */}
              <motion.div
                className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 relative overflow-hidden"
                variants={itemVariants}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent" />
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Nuestra Visión
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Impulsar a empresas y emprendedores con herramientas digitales
                  efectivas, ayudándolos a crecer y destacar en un mercado cada
                  vez más competitivo.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
