import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: LayoutDashboard,
    title: "Panel centralizado",
    description:
      "Todos tus proyectos, clientes y productos organizados en un solo lugar. Acceso rápido a lo que necesitás.",
  },
  {
    icon: BarChart3,
    title: "Métricas claras",
    description:
      "Visualizá el rendimiento de tus servicios con datos simples y útiles para tomar decisiones.",
  },
  {
    icon: Users,
    title: "Accesos controlados",
    description:
      "Definí quién puede ver y gestionar cada proyecto. Roles claros para tu equipo y clientes.",
  },
  {
    icon: Settings,
    title: "Gestión autónoma",
    description:
      "Administrá tu cuenta, actualizá información y controlá tus servicios sin depender de nadie.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, type: "tween" as const },
  },
};

export const PlatformSection = () => {
  return (
    <section id="plataforma" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/10" />
      
      {/* Animated glow */}
      <motion.div 
        className="absolute top-0 -left-40 w-[500px] h-[800px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.3) 0%, transparent 60%)',
        }}
        animate={{ 
          x: [0, 30, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Static grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(187 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(187 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Decorative lines */}
      <motion.div 
        className="absolute top-0 bottom-0 left-[10%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute top-0 bottom-0 right-[10%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            La Plataforma
          </h2>
          <p className="text-muted-foreground">
            Una base sólida para organizar y controlar todos tus servicios tecnológicos.
          </p>
        </motion.div>

        <motion.div 
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card
                className="group bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/40 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="p-6">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20 group-hover:border-primary/40"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
