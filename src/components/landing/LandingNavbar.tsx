import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Plataforma", href: "#plataforma" },
  { label: "Servicios", href: "#servicios" },
  { label: "Seguridad", href: "#seguridad" },
  { label: "Contacto", href: "#contacto" },
];

export const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5" 
          : "bg-transparent"
      }`}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center relative group">
            <Logo size="sm" />
            <div className="absolute -inset-2 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-3/4 transition-all duration-200" />
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild className="relative overflow-hidden group">
              <Link to="/login">
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Entrar
                </span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative overflow-hidden border border-primary/30 bg-primary/5 hover:bg-primary/10"
              >
                <Menu className="h-5 w-5 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] bg-background/95 backdrop-blur-xl border-l border-primary/20"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <Logo size="sm" />
                </SheetTitle>
              </SheetHeader>
              
              {/* Decorative line */}
              <div className="mt-4 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
              
              <div className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="relative text-left text-muted-foreground hover:text-foreground transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-primary/10 group"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-200" />
                      {link.label}
                    </span>
                  </button>
                ))}
                
                <div className="pt-6 mt-4 border-t border-border/50">
                  <Button asChild className="w-full h-12 text-base">
                    <Link to="/login">
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Entrar al sistema
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute bottom-8 left-6 right-6">
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <p className="text-[10px] text-muted-foreground/50 text-center mt-4">
                  Powered by Digital Builders
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Bottom glow effect when scrolled */}
      <div 
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
      />
    </nav>
  );
};
