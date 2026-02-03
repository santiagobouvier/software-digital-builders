import { Check } from "lucide-react";

const features = [
  "Actualizá contenido de tu web sin ayuda técnica",
  "Controlá el estado de tus bots en tiempo real",
  "Visualizá métricas y reportes de actividad",
  "Gestioná accesos y usuarios de tu cuenta",
  "Revisá historial de cambios y actualizaciones",
  "Solicitá soporte directamente desde el panel",
];

export const SelfServiceSection = () => {
  return (
    <section id="autogestion" className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Static lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      
      {/* Static corner element */}
      <div className="absolute bottom-12 left-8 hidden sm:block">
        <div className="w-12 h-12 border-l border-b border-border/30 rounded-bl-xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Autogestión
              </h2>
              <p className="text-muted-foreground mb-8">
                Independencia total para gestionar tus proyectos. 
                Controlá todo desde tu panel, cuando quieras.
              </p>

              <div className="grid sm:grid-cols-2 gap-2">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors duration-200 group cursor-default"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 group-hover:bg-primary/30 transition-colors duration-200">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              {/* Static glow behind */}
              <div 
                className="absolute -inset-8 opacity-30"
                style={{
                  background: 'radial-gradient(circle at center, hsl(187 100% 50% / 0.2) 0%, transparent 60%)',
                }}
              />
              
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                {/* Mock interface elements */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div className="h-2 w-28 bg-muted rounded" />
                    </div>
                    <div className="h-8 w-24 bg-primary/20 rounded-lg border border-primary/30" />
                  </div>

                  {/* List items */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg border border-border/30 hover:border-primary/30 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/20" />
                        <div className="space-y-1.5">
                          <div className="h-2 w-24 bg-muted rounded" />
                          <div className="h-1.5 w-16 bg-muted/50 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-6 bg-muted/60 rounded" />
                        <div className="h-6 w-6 bg-muted/60 rounded" />
                      </div>
                    </div>
                  ))}

                  {/* Action bar */}
                  <div className="flex gap-2 pt-2">
                    <div className="h-9 flex-1 bg-primary/30 rounded-lg border border-primary/40" />
                    <div className="h-9 w-9 bg-muted/50 rounded-lg border border-border/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
