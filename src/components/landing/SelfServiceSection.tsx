import { Check } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Actualizá contenido de tu web sin ayuda técnica",
  "Controlá el estado de tus bots en tiempo real",
  "Visualizá métricas y reportes de actividad",
  "Gestioná accesos y usuarios de tu cuenta",
  "Revisá historial de cambios y actualizaciones",
  "Solicitá soporte directamente desde el panel",
];

const featureVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

export const SelfServiceSection = () => {
  return (
    <section id="autogestion" className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Clean background with minimal accents */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent"
      />
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent"
      />
      
      {/* Subtle corner elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-12 left-8 hidden sm:block"
      >
        <div className="w-12 h-12 border-l border-b border-border/30 rounded-bl-xl" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl font-bold mb-4"
              >
                Autogestión
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-muted-foreground mb-8"
              >
                Independencia total para gestionar tus proyectos. 
                Controlá todo desde tu panel, cuando quieras.
              </motion.p>

              <div className="grid sm:grid-cols-2 gap-2">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    custom={i}
                    variants={featureVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors group cursor-default"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: 0.3 + i * 0.08, 
                        type: "spring",
                        stiffness: 300 
                      }}
                      className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 group-hover:bg-primary/30 transition-colors"
                    >
                      <Check className="h-3 w-3 text-primary" />
                    </motion.div>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 60, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, type: "spring", stiffness: 80 }}
              className="relative"
              style={{ perspective: "1000px" }}
            >
              {/* Glow behind */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.3, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute -inset-8"
                style={{
                  background: 'radial-gradient(circle at center, hsl(187 100% 50% / 0.2) 0%, transparent 60%)',
                  filter: 'blur(40px)',
                }}
              />
              
              <motion.div 
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6"
              >
                {/* Mock interface elements */}
                <div className="space-y-4">
                  {/* Header */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between pb-4 border-b border-border/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div className="h-2 w-28 bg-muted rounded" />
                    </div>
                    <div className="h-8 w-24 bg-primary/20 rounded-lg border border-primary/30" />
                  </motion.div>

                  {/* List items */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg border border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                          className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/20"
                        />
                        <div className="space-y-1.5">
                          <div className="h-2 w-24 bg-muted rounded" />
                          <div className="h-1.5 w-16 bg-muted/50 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-6 bg-muted/60 rounded" />
                        <div className="h-6 w-6 bg-muted/60 rounded" />
                      </div>
                    </motion.div>
                  ))}

                  {/* Action bar */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="flex gap-2 pt-2"
                  >
                    <div className="h-9 flex-1 bg-primary/30 rounded-lg border border-primary/40" />
                    <div className="h-9 w-9 bg-muted/50 rounded-lg border border-border/50" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
