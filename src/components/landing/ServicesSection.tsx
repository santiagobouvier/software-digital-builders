import {
  Globe,
  Smartphone,
  MessageSquare,
  Instagram,
  Building2,
  Code2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const services = [
  {
    icon: Globe,
    title: "Páginas web rápidas",
    description:
      "Sitios web optimizados, veloces y profesionales. Listos para captar clientes y mostrar tu negocio de forma clara.",
  },
  {
    icon: Smartphone,
    title: "Páginas web autogestionables",
    description:
      "Administra tu propio contenido sin depender de nadie. Actualiza textos, imágenes y secciones cuando quieras.",
  },
  {
    icon: MessageSquare,
    title: "Bots para WhatsApp",
    description:
      "Automatiza la atención al cliente en WhatsApp. Responde consultas, capta leads y mejora los tiempos de respuesta.",
  },
  {
    icon: Instagram,
    title: "Bots para Instagram",
    description:
      "Gestiona mensajes directos y comentarios de forma automática. Aumenta el engagement sin esfuerzo manual.",
  },
  {
    icon: Building2,
    title: "Bots internos para empresas",
    description:
      "Automatiza procesos internos, notificaciones y flujos de trabajo. Soluciones adaptadas a tu operación.",
  },
  {
    icon: Code2,
    title: "Software y sistemas a medida",
    description:
      "Desarrollo de soluciones personalizadas para necesidades específicas. Servicio premium con acompañamiento dedicado.",
    premium: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export const ServicesSection = () => {
  return (
    <section id="servicios" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/5" />

      {/* Animated glow */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 0.15, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 -right-40 w-[500px] h-[600px] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(187 100% 50% / 0.25) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      {/* Decorative lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent"
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
            Servicios
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Soluciones tecnológicas prácticas para hacer crecer tu negocio.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -8,
                transition: { duration: 0.25 },
              }}
            >
              <Card
                className={`group bg-card/60 backdrop-blur-sm h-full transition-all duration-300 ${
                  service.premium
                    ? "border-primary/40 hover:border-primary/60"
                    : "border-border/40 hover:border-border/60"
                }`}
              >
                <CardContent className="p-6">
                  {service.premium && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3 border border-primary/20"
                    >
                      Premium
                    </motion.span>
                  )}
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.4 },
                    }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 border ${
                      service.premium
                        ? "bg-primary/20 border-primary/30 group-hover:bg-primary/30 group-hover:border-primary/50 group-hover:shadow-glow"
                        : "bg-primary/10 border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40"
                    }`}
                  >
                    <service.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
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
