import {
  Globe,
  Smartphone,
  MessageSquare,
  Instagram,
  Building2,
  Code2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

export const ServicesSection = () => {
  return (
    <section id="servicios" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/5" />

      {/* Static glow */}
      <div
        className="absolute top-1/2 -right-40 w-[500px] h-[600px] -translate-y-1/2 opacity-15"
        style={{
          background: "radial-gradient(ellipse at center, hsl(187 100% 50% / 0.25) 0%, transparent 60%)",
        }}
      />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Servicios
          </h2>
          <p className="text-muted-foreground">
            Soluciones tecnológicas prácticas para hacer crecer tu negocio.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <Card
              key={service.title}
              className={`group bg-card/60 backdrop-blur-sm h-full transition-all duration-200 hover:-translate-y-1 ${
                service.premium
                  ? "border-primary/40 hover:border-primary/60"
                  : "border-border/40 hover:border-border/60"
              }`}
            >
              <CardContent className="p-6">
                {service.premium && (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3 border border-primary/20">
                    Premium
                  </span>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200 border ${
                    service.premium
                      ? "bg-primary/20 border-primary/30 group-hover:bg-primary/30 group-hover:border-primary/50"
                      : "bg-primary/10 border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40"
                  }`}
                >
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
