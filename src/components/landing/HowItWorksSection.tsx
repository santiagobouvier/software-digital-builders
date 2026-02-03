import { Building2, Plug, LineChart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Crea tu empresa y bots",
    description:
      "Registra tu organización y configura los bots que gestionarás. Define nombres, estados y asigna clientes.",
  },
  {
    number: "02",
    icon: Plug,
    title: "Conecta vía API",
    description:
      "Integra tus automatizaciones usando el endpoint de tracking. Envía eventos con token seguro desde cualquier plataforma.",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Monitorea y factura",
    description:
      "Visualiza métricas en tiempo real, gestiona suscripciones y controla el rendimiento de cada bot.",
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      type: "spring" as const,
      stiffness: 100,
    },
  }),
};

export const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <section ref={sectionRef} className="py-20 sm:py-32 relative overflow-hidden">
      {/* Rich background with flowing gradient */}
      <div className="absolute inset-0 bg-secondary/5" />
      
      {/* Large flowing gradient - animated */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.2, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px]"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.15) 0%, hsl(200 100% 60% / 0.1) 30%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Horizontal flowing line - scroll animated */}
      <motion.div 
        style={{ scaleX: lineProgress }}
        className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left"
      />

      {/* Grid pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(187 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(187 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Cómo funciona
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Tres pasos para tener control total sobre tus automatizaciones.
          </motion.p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number} 
                custom={index}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="relative group"
              >
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px origin-left"
                  >
                    <div className="w-full h-full bg-gradient-to-r from-primary/30 via-primary/20 to-transparent" />
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + index * 0.2, type: "spring" }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/30"
                    />
                  </motion.div>
                )}

                <div className="text-center">
                  {/* Step number with glow */}
                  <motion.div 
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.4 }
                    }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 mb-6 relative group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-glow cursor-pointer"
                  >
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.2, type: "spring", stiffness: 200 }}
                      className="absolute -top-3 -right-3 text-xs font-mono text-primary bg-background px-3 py-1 rounded-full border border-primary/30 shadow-sm"
                    >
                      {step.number}
                    </motion.span>
                    <motion.div
                      initial={{ rotate: -90, opacity: 0 }}
                      whileInView={{ rotate: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
                    >
                      <step.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors"
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {step.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
