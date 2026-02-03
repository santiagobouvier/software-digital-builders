import {
  Bot,
  BarChart3,
  Users,
  CreditCard,
  Code,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const modules = [
  {
    icon: Bot,
    title: "Gestión de Bots",
    description:
      "Crea, configura y controla múltiples bots desde un panel centralizado. Pausa, activa y monitorea en tiempo real.",
  },
  {
    icon: BarChart3,
    title: "Métricas y KPIs",
    description:
      "Visualiza mensajes entrantes/salientes, leads generados, handoffs y errores. Datos diarios agregados automáticamente.",
  },
  {
    icon: Users,
    title: "Roles y Accesos",
    description:
      "Sistema multi-tenant con roles profesional y cliente. Asigna bots específicos a cada usuario con permisos granulares.",
  },
  {
    icon: CreditCard,
    title: "Suscripciones y Facturación",
    description:
      "Gestiona planes mensuales y anuales por bot. Control de MRR/ARR, vencimientos y eventos de facturación.",
  },
  {
    icon: Code,
    title: "API de Tracking",
    description:
      "Endpoint REST para recibir eventos desde cualquier plataforma. Autenticación por token y agregación automática.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
    rotateX: 15,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export const PlatformSection = () => {
  return (
    <section id="plataforma" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background with glow effects */}
      <div className="absolute inset-0 bg-secondary/10" />
      
      {/* Large side glow - animated */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 0.2, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 -left-40 w-[500px] h-[800px]"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.3) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Subtle grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(187 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(187 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Decorative vertical lines - animated */}
      <motion.div 
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-0 bottom-0 left-[10%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block origin-top"
      />
      <motion.div 
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute top-0 bottom-0 right-[10%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block origin-bottom"
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
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            La Plataforma
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Un sistema completo para gestionar, medir y monetizar tus automatizaciones.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03,
                y: -8,
                transition: { duration: 0.25 }
              }}
              className={index === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}
              style={{ perspective: "1000px" }}
            >
              <Card
                variant="interactive"
                className="group bg-card/60 backdrop-blur-sm border-border/40 h-full"
              >
                <CardContent className="p-6">
                  <motion.div 
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300 border border-primary/20 group-hover:border-primary/40 group-hover:shadow-glow"
                  >
                    <module.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {module.description}
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
