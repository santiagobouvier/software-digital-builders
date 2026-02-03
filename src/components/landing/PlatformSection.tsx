import {
  Bot,
  BarChart3,
  Users,
  CreditCard,
  Code,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

export const PlatformSection = () => {
  return (
    <section id="plataforma" className="py-20 sm:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            La Plataforma
          </h2>
          <p className="text-muted-foreground">
            Un sistema completo para gestionar, medir y monetizar tus automatizaciones.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {modules.map((module) => (
            <Card
              key={module.title}
              variant="interactive"
              className="group"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <module.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
