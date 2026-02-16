import { useState } from "react";
import {
  Globe,
  Smartphone,
  MessageSquare,
  Building2,
  Code2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServiceWhatsAppDialog } from "./ServiceWhatsAppDialog";
import { ServiceWebRapidaDialog } from "./ServiceWebRapidaDialog";
import { ServiceWebAutogestionableDialog } from "./ServiceWebAutogestionableDialog";
import { ServiceBotInternoDialog } from "./ServiceBotInternoDialog";
import { ServiceSoftwareDialog } from "./ServiceSoftwareDialog";

const services = [
  {
    icon: Globe,
    title: "Páginas web rápidas",
    description:
      "Sitios web optimizados, veloces y profesionales. Listos para captar clientes y mostrar tu negocio de forma clara.",
    dialogId: "web-rapida" as const,
  },
  {
    icon: Smartphone,
    title: "Páginas web autogestionables",
    description:
      "Administra tu propio contenido sin depender de nadie. Actualiza textos, imágenes y secciones cuando quieras.",
    dialogId: "web-autogestionable" as const,
  },
  {
    icon: MessageSquare,
    title: "Bots para WhatsApp",
    description:
      "Automatiza la atención al cliente en WhatsApp. Responde consultas, capta leads y mejora los tiempos de respuesta.",
    dialogId: "whatsapp" as const,
  },
  {
    icon: Building2,
    title: "Bots internos para empresas",
    description:
      "Automatiza procesos internos, notificaciones y flujos de trabajo. Soluciones adaptadas a tu operación.",
    dialogId: "bot-interno" as const,
  },
  {
    icon: Code2,
    title: "Software y sistemas a medida",
    description:
      "Desarrollo de soluciones personalizadas para necesidades específicas. Servicio premium con acompañamiento dedicado.",
    premium: true,
    dialogId: "software" as const,
  },
];

export const ServicesSection = () => {
  const reduceMotion = useReducedMotion();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, type: "tween" as const },
    },
  };

  return (
    <section id="servicios" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/5" />

      {/* Animated glow - only on desktop */}
      {!reduceMotion && (
        <motion.div
          className="absolute top-1/2 -right-40 w-[500px] h-[600px] -translate-y-1/2 opacity-15"
          style={{
            background: "radial-gradient(ellipse at center, hsl(187 100% 50% / 0.25) 0%, transparent 60%)",
          }}
          animate={{ 
            y: ["-50%", "-45%", "-50%"],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Top line - only on desktop */}
      {!reduceMotion && (
        <motion.div 
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {reduceMotion ? (
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Servicios
            </h2>
            <p className="text-muted-foreground">
              Soluciones tecnológicas prácticas para hacer crecer tu negocio.
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Servicios
            </h2>
            <p className="text-muted-foreground">
              Soluciones tecnológicas prácticas para hacer crecer tu negocio.
            </p>
          </motion.div>
        )}

        {reduceMotion ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <Card
                key={service.title}
                onClick={() => service.dialogId && setOpenDialog(service.dialogId)}
                className={`group bg-card/60 backdrop-blur-sm h-full ${
                  service.dialogId ? "cursor-pointer" : ""
                } ${
                  service.premium
                    ? "border-primary/40"
                    : "border-border/40"
                }`}
              >
                <CardContent className="p-6">
                  {service.premium && (
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3 border border-primary/20">
                      Premium
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${
                      service.premium
                        ? "bg-primary/20 border-primary/30"
                        : "bg-primary/10 border-primary/20"
                    }`}
                  >
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {services.map((service) => (
              <motion.div key={service.title} variants={itemVariants}>
                <Card
                  onClick={() => service.dialogId && setOpenDialog(service.dialogId)}
                  className={`group bg-card/60 backdrop-blur-sm h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    service.dialogId ? "cursor-pointer" : ""
                  } ${
                    service.premium
                      ? "border-primary/40 hover:border-primary/60 hover:shadow-primary/10"
                      : "border-border/40 hover:border-primary/40 hover:shadow-primary/5"
                  }`}
                >
                  <CardContent className="p-6">
                    {service.premium && (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3 border border-primary/20">
                        Premium
                      </span>
                    )}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 border ${
                        service.premium
                          ? "bg-primary/20 border-primary/30 group-hover:bg-primary/30 group-hover:border-primary/50"
                          : "bg-primary/10 border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40"
                      }`}
                    >
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
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
        )}
      </div>

      <ServiceWhatsAppDialog
        open={openDialog === "whatsapp"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
      <ServiceWebRapidaDialog
        open={openDialog === "web-rapida"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
      <ServiceWebAutogestionableDialog
        open={openDialog === "web-autogestionable"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
      <ServiceBotInternoDialog
        open={openDialog === "bot-interno"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
      <ServiceSoftwareDialog
        open={openDialog === "software"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
    </section>
  );
};
