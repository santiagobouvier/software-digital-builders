import {
  Shield,
  Users,
  Lock,
  Plug,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const features = [
  {
    icon: Users,
    title: "Roles y permisos",
    description:
      "Cada persona accede solo a lo que necesita. Control claro sobre quién ve y gestiona cada proyecto.",
  },
  {
    icon: Lock,
    title: "Accesos seguros",
    description:
      "Tus datos están protegidos. Solo usuarios autorizados pueden ingresar al sistema.",
  },
  {
    icon: Shield,
    title: "Datos separados",
    description:
      "La información de cada cliente está aislada. Orden y privacidad garantizados.",
  },
  {
    icon: Plug,
    title: "Conexiones controladas",
    description:
      "Las integraciones con otros sistemas se gestionan de forma segura y organizada.",
  },
];

export const SecuritySection = () => {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, type: "tween" as const },
    },
  };

  return (
    <section id="seguridad" className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Top line - only on desktop */}
      {!reduceMotion && (
        <motion.div 
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      
      {/* Corner accents - only on desktop */}
      {!reduceMotion && (
        <>
          <motion.div 
            className="absolute top-12 left-8 hidden sm:block"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="w-20 h-20 border-l border-t border-border/20 rounded-tl-2xl" />
          </motion.div>
          <motion.div 
            className="absolute bottom-12 right-8 hidden sm:block"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="w-20 h-20 border-r border-b border-border/20 rounded-br-2xl" />
          </motion.div>
        </>
      )}

      {/* Dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(hsl(187 100% 50%) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {reduceMotion ? (
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Seguridad y Control
            </h2>
            <p className="text-muted-foreground">
              Confianza y organización en cada acceso.
            </p>
          </div>
        ) : (
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-6"
              whileInView={{ rotate: [0, 10, -10, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Seguridad y Control
            </h2>
            <p className="text-muted-foreground">
              Confianza y organización en cada acceso.
            </p>
          </motion.div>
        )}

        {reduceMotion ? (
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-card/30 border-border/30 h-full"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center border border-border/50">
                      <feature.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card
                  className="bg-card/30 border-border/30 hover:border-primary/40 transition-all duration-300 group h-full hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center border border-border/50 group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors duration-300">
                        <feature.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
