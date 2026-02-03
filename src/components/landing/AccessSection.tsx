import { Link } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AccessSection = () => {
  return (
    <section
      id="acceso"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      {/* Static central glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, hsl(187 100% 50% / 0.25) 0%, transparent 60%)",
        }}
      />

      {/* Static decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-6">
            <LogIn className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Entrar al sistema
          </h2>

          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Si ya sos cliente, accedé a tu panel para gestionar tus proyectos,
            ver métricas y administrar tu cuenta.
          </p>

          <Button
            asChild
            size="lg"
            className="min-w-[200px] h-12 text-base font-semibold shadow-glow hover-scale"
          >
            <Link to="/login">
              Acceder a mi cuenta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground/60 mt-6">
            ¿No tenés cuenta? Contactanos para comenzar.
          </p>
        </div>
      </div>
    </section>
  );
};
