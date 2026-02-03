import {
  Shield,
  Users,
  Lock,
  Plug,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    scale: 0.8,
    filter: "blur(10px)",
    y: 40,
    rotate: i % 2 === 0 ? -3 : 3,
  }),
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      type: "spring" as const,
      stiffness: 100,
    },
  }),
};

export const SecuritySection = () => {
  return (
    <section id="seguridad" className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Clean, minimal background */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"
      />
      
      {/* Subtle corner accents - animated */}
      <motion.div 
        initial={{ opacity: 0, x: -20, y: -20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-12 left-8 hidden sm:block"
      >
        <div className="w-20 h-20 border-l border-t border-border/20 rounded-tl-2xl" />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute bottom-12 right-8 hidden sm:block"
      >
        <div className="w-20 h-20 border-r border-b border-border/20 rounded-br-2xl" />
      </motion.div>

      {/* Very subtle dot pattern - fade in */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.015 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(hsl(187 100% 50%) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Seguridad y Control
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Confianza y organización en cada acceso.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              whileHover={{ 
                scale: 1.03, 
                y: -5,
                transition: { duration: 0.25 }
              }}
            >
              <Card
                className="bg-card/30 border-border/30 hover:border-border/60 transition-all duration-300 group h-full"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div 
                      initial={{ scale: 0, rotate: 180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: 0.3 + index * 0.1, 
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                      className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      <feature.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1 group-hover:text-foreground transition-colors">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
