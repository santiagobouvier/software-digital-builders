import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
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
    window.addEventListener("scroll", handleScroll);
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
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5" 
          : "bg-transparent"
      }`}
    >
      {/* Animated glow line at top */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo with glow effect */}
          <Link to="/" className="flex items-center relative group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Logo size="sm" />
            </motion.div>
            <div className="absolute -inset-2 bg-primary/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                onClick={() => scrollToSection(link.href)}
                className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span className="relative z-10">{link.label}</span>
                <motion.div 
                  className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="navHover"
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-3/4 transition-all duration-300" />
              </motion.button>
            ))}
          </div>

          {/* Desktop CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:flex items-center gap-3"
          >
            <Button asChild className="relative overflow-hidden group">
              <Link to="/login">
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Entrar
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <motion.div
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative overflow-hidden border border-primary/30 bg-primary/5 hover:bg-primary/10"
                >
                  <Menu className="h-5 w-5 text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50" />
                </Button>
              </motion.div>
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
                <AnimatePresence>
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      onClick={() => scrollToSection(link.href)}
                      className="relative text-left text-muted-foreground hover:text-foreground transition-all py-3 px-4 rounded-lg hover:bg-primary/10 group"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary group-hover:shadow-glow transition-all" />
                        {link.label}
                      </span>
                    </motion.button>
                  ))}
                </AnimatePresence>
                
                <div className="pt-6 mt-4 border-t border-border/50">
                  <Button asChild className="w-full h-12 text-base relative overflow-hidden group">
                    <Link to="/login">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Entrar al sistema
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] group-hover:animate-pulse" />
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
    </motion.nav>
  );
};
