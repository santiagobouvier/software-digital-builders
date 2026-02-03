import { Logo } from "@/components/Logo";

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Digital Builders. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
