import { AlertTriangle, BarChart3, Users, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const problems = [
  {
    icon: BarChart3,
    title: "Sin métricas centralizadas",
    description:
      "Los datos de tus bots están dispersos y no puedes medir rendimiento real ni tomar decisiones basadas en datos.",
  },
  {
    icon: Users,
    title: "Gestión manual de clientes",
    description:
      "Crear accesos, asignar bots y gestionar permisos es un proceso manual que consume tiempo y genera errores.",
  },
  {
    icon: CreditCard,
    title: "Facturación desorganizada",
    description:
      "Sin control de suscripciones ni visibilidad de ingresos recurrentes. Cobros manuales y seguimiento inexistente.",
  },
  {
    icon: AlertTriangle,
    title: "Falta de visibilidad operativa",
    description:
      "No sabes cuántos mensajes procesan tus bots, cuántos leads generan ni cuándo fallan hasta que el cliente reclama.",
  },
];

export const ProblemsSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Problemas que resolvemos
          </h2>
          <p className="text-muted-foreground">
            Si trabajas con bots de automatización, probablemente enfrentas estos desafíos diarios.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {problems.map((problem) => (
            <Card
              key={problem.title}
              variant="interactive"
              className="group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <problem.icon className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {problem.description}
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
