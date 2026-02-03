import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: LayoutDashboard,
    title: "Panel centralizado",
    description:
      "Todos tus proyectos, webs y bots organizados en un solo lugar. Acceso rápido a lo que necesitás.",
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

export const PlatformSection = () => {
  return (
    <section id="plataforma" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/10" />
      
      {/* Static glow */}
      <div 
        className="absolute top-0 -left-40 w-[500px] h-[800px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.3) 0%, transparent 60%)',
        }}
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

      {/* Static decorative lines */}
      <div className="absolute top-0 bottom-0 left-[10%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block" />
      <div className="absolute top-0 bottom-0 right-[10%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            La Plataforma
          </h2>
          <p className="text-muted-foreground">
            Una base sólida para organizar y controlar todos tus servicios tecnológicos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group bg-card/60 backdrop-blur-sm border-border/40 hover:border-border/60 h-full transition-all duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200 border border-primary/20 group-hover:border-primary/40">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
