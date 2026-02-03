import {
  Shield,
  Users,
  Lock,
  Plug,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <section id="seguridad" className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      
      {/* Static corner accents */}
      <div className="absolute top-12 left-8 hidden sm:block">
        <div className="w-20 h-20 border-l border-t border-border/20 rounded-tl-2xl" />
      </div>
      <div className="absolute bottom-12 right-8 hidden sm:block">
        <div className="w-20 h-20 border-r border-b border-border/20 rounded-br-2xl" />
      </div>

      {/* Static dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(hsl(187 100% 50%) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Seguridad y Control
          </h2>
          <p className="text-muted-foreground">
            Confianza y organización en cada acceso.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-card/30 border-border/30 hover:border-border/60 transition-all duration-200 group h-full hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors duration-200">
                    <feature.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-foreground transition-colors duration-200">{feature.title}</h3>
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
