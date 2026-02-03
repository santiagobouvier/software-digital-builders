import {
  Building2,
  Shield,
  Lock,
  Server,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Building2,
    title: "Multi-tenant real",
    description:
      "Cada empresa opera en un espacio aislado. Los datos de una organización nunca se mezclan con otra.",
  },
  {
    icon: Shield,
    title: "Roles y permisos",
    description:
      "Control granular de acceso. Profesionales gestionan todo, clientes solo ven sus bots asignados.",
  },
  {
    icon: Lock,
    title: "Aislamiento de datos",
    description:
      "Row Level Security (RLS) en cada tabla. Las políticas de acceso se aplican a nivel de base de datos.",
  },
  {
    icon: Server,
    title: "Infraestructura cloud",
    description:
      "Desplegado en infraestructura de nivel enterprise con backups automáticos y alta disponibilidad.",
  },
  {
    icon: TrendingUp,
    title: "Escalabilidad",
    description:
      "Arquitectura diseñada para crecer. Soporta miles de bots y millones de eventos sin degradación.",
  },
];

export const SecuritySection = () => {
  return (
    <section id="seguridad" className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Seguridad y Arquitectura
          </h2>
          <p className="text-muted-foreground">
            Infraestructura enterprise-ready para operaciones críticas de negocio.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-card/50 border-border/30"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
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
      </div>
    </section>
  );
};
