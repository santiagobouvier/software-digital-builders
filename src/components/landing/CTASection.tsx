import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-20 sm:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Subtle background effect */}
      <div className="absolute inset-0 grid-background opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Comienza a gestionar tus bots{" "}
            <span className="text-primary">hoy</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Control total sobre métricas, usuarios y facturación desde una única plataforma.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[180px]">
              <Link to="/login">
                Entrar al sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <a href="mailto:contacto@digitalbuilders.net">
                Contactar
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
