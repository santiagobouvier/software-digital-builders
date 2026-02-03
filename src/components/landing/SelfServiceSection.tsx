import { Check } from "lucide-react";

const features = [
  "Crear y pausar bots sin intervención técnica",
  "Gestionar usuarios y asignar roles",
  "Dar acceso a clientes a bots específicos",
  "Visualizar métricas en tiempo real",
  "Controlar suscripciones y vencimientos",
  "Monitorear estados y errores de cada bot",
  "Exportar datos de facturación",
  "Configurar planes y precios por bot",
];

export const SelfServiceSection = () => {
  return (
    <section id="autogestion" className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Autogestión total
              </h2>
              <p className="text-muted-foreground mb-8">
                Control completo sobre tu operación sin depender de soporte técnico. 
                Administra bots, usuarios y facturación desde un único lugar.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl blur-xl" />
              <div className="relative bg-card border border-border/50 rounded-xl p-6">
                {/* Mock interface elements */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="h-2 w-32 bg-muted rounded" />
                    <div className="h-8 w-24 bg-primary/20 rounded" />
                  </div>

                  {/* List items */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                        <div className="space-y-1">
                          <div className="h-2 w-24 bg-muted rounded" />
                          <div className="h-1.5 w-16 bg-muted/50 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-6 bg-muted rounded" />
                        <div className="h-6 w-6 bg-muted rounded" />
                      </div>
                    </div>
                  ))}

                  {/* Action bar */}
                  <div className="flex gap-2 pt-4">
                    <div className="h-9 flex-1 bg-primary/30 rounded" />
                    <div className="h-9 w-9 bg-muted rounded" />
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
