import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 0.1]);

  return (
    <section ref={sectionRef} className="py-24 sm:py-36 relative overflow-hidden">
      {/* Rich gradient background */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/10 to-background"
      />
      
      {/* Large central glow - scroll animated */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px]"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.2) 0%, hsl(187 100% 50% / 0.05) 40%, transparent 70%)',
          filter: 'blur(60px)',
          scale: glowScale,
          opacity: glowOpacity,
        }}
      />
      
      {/* Animated grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.04 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(187 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(187 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative elements - staggered animation */}
      <motion.div 
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-1/4 left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden sm:block origin-top"
      />
      <motion.div 
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-1/3 right-[5%] w-px h-24 bg-gradient-to-b from-transparent via-primary/15 to-transparent hidden sm:block origin-bottom"
      />
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-1/2 left-[15%] w-20 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden sm:block origin-left"
      />
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-[40%] right-[12%] w-16 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent hidden sm:block origin-right"
      />

      {/* Floating orbs - animated */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, type: "spring" }}
        animate={{ y: [0, -10, 0] }}
        className="absolute top-1/4 left-[20%] w-2 h-2 rounded-full bg-primary/40"
        style={{ animationDuration: '3s' }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1, type: "spring" }}
        animate={{ y: [0, 10, 0] }}
        className="absolute top-2/3 right-[25%] w-1.5 h-1.5 rounded-full bg-primary/30"
        style={{ animationDuration: '4s' }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          >
            Comienza a gestionar tus bots{" "}
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              className="text-primary relative inline-block"
            >
              hoy
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute -inset-2 bg-primary/20 blur-lg -z-10 rounded-lg"
              />
            </motion.span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Control total sobre métricas, usuarios y facturación desde una única plataforma.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div 
              whileHover={{ scale: 1.08, y: -3 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button asChild size="lg" className="min-w-[180px] h-12 text-base font-semibold shadow-glow hover:shadow-glow-lg transition-shadow">
                <Link to="/login">
                  Entrar al sistema
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.08, y: -3 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button asChild variant="outline" size="lg" className="min-w-[180px] h-12 text-base border-border/60 hover:border-primary/50 hover:bg-primary/5">
                <a href="mailto:contacto@digitalbuilders.net">
                  Contactar
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
