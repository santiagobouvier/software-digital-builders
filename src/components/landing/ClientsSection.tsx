// Placeholder logos - en producción se reemplazarían por logos reales de clientes
const clients = [
  { name: "Empresa 1", initials: "E1" },
  { name: "Empresa 2", initials: "E2" },
  { name: "Empresa 3", initials: "E3" },
  { name: "Empresa 4", initials: "E4" },
  { name: "Empresa 5", initials: "E5" },
  { name: "Empresa 6", initials: "E6" },
];

export const ClientsSection = () => {
  return (
    <section id="clientes" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Empresas que confían en nosotros
          </h2>
          <p className="text-muted-foreground text-sm">
            Trabajamos con negocios que buscan soluciones tecnológicas reales.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 max-w-4xl mx-auto">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-card/50 border border-border/40 flex items-center justify-center transition-all duration-200 group-hover:border-primary/40 group-hover:bg-card/80 hover-scale">
                <span className="text-xl sm:text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors duration-200">
                  {client.initials}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          Y más empresas sumándose cada mes
        </p>
      </div>
    </section>
  );
};
