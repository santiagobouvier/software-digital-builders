import { Building2, Plug, LineChart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Crea tu empresa y bots",
    description:
      "Registra tu organización y configura los bots que gestionarás. Define nombres, estados y asigna clientes.",
  },
  {
    number: "02",
    icon: Plug,
    title: "Conecta vía API",
    description:
      "Integra tus automatizaciones usando el endpoint de tracking. Envía eventos con token seguro desde cualquier plataforma.",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Monitorea y factura",
    description:
      "Visualiza métricas en tiempo real, gestiona suscripciones y controla el rendimiento de cada bot.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Cómo funciona
          </h2>
          <p className="text-muted-foreground">
            Tres pasos para tener control total sobre tus automatizaciones.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
                )}

                <div className="text-center">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border/50 mb-6 relative">
                    <span className="absolute -top-2 -right-2 text-xs font-mono text-primary bg-background px-2 py-0.5 rounded border border-border">
                      {step.number}
                    </span>
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
