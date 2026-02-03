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
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Rich background with flowing gradient */}
      <div className="absolute inset-0 bg-secondary/5" />
      
      {/* Large flowing gradient */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.15) 0%, hsl(200 100% 60% / 0.1) 30%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Horizontal flowing line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(187 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(187 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Cómo funciona
          </h2>
          <p className="text-muted-foreground">
            Tres pasos para tener control total sobre tus automatizaciones.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group">
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px">
                    <div className="w-full h-full bg-gradient-to-r from-primary/30 via-primary/20 to-transparent" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/30" />
                  </div>
                )}

                <div className="text-center">
                  {/* Step number with glow */}
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 mb-6 relative group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-glow">
                    <span className="absolute -top-3 -right-3 text-xs font-mono text-primary bg-background px-3 py-1 rounded-full border border-primary/30 shadow-sm">
                      {step.number}
                    </span>
                    <step.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
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
