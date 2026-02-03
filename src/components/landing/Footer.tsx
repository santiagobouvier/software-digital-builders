import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const Footer = () => {
  return (
    <footer className="py-10 border-t border-border/30 bg-background relative overflow-hidden">
      {/* Subtle top glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.2) 0%, transparent 60%)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="hidden sm:block w-px h-6 bg-border/50" />
            <span className="hidden sm:block text-xs text-muted-foreground">
              Soluciones Tecnológicas
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors duration-200">
              Acceder
            </Link>
            <a href="mailto:contacto@digitalbuilders.net" className="hover:text-foreground transition-colors duration-200">
              Contacto
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Digital Builders. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
