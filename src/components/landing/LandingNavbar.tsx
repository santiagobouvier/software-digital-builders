import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

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

  // Generate stars once
  const stars = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    })), []
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5" 
            : "bg-transparent"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <Link to="/" className="flex items-center relative group">
              <Logo size="sm" />
              <div className="absolute -inset-2 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>

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

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(true)}
              className="md:hidden relative overflow-hidden border border-primary/30 bg-primary/5 hover:bg-primary/10"
            >
              <Menu className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
        
        <div 
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        />
      </nav>

      {/* Space-themed Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] md:hidden bg-background"
          >
            {/* Starfield */}
            <div className="absolute inset-0 overflow-hidden">
              {stars.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: star.delay,
                  }}
                />
              ))}
            </div>

            {/* Subtle nebula glows */}
            <motion.div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-15"
              style={{
                background: "radial-gradient(circle, hsl(187 100% 50% / 0.4) 0%, transparent 60%)",
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-[200px] h-[200px] opacity-10"
              style={{
                background: "radial-gradient(circle, hsl(260 80% 60% / 0.3) 0%, transparent 60%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />

            {/* Close button - floating */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 z-10 p-2"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <X className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
              </motion.div>
            </motion.button>

            {/* Content - all floating */}
            <div className="relative h-full flex flex-col items-center justify-center px-8">
              {/* Floating Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-14"
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    x: [0, 2, 0],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Logo size="lg" className="h-16 opacity-90" />
                </motion.div>
              </motion.div>

              {/* Navigation Links - All floating independently */}
              <nav className="flex flex-col items-center gap-5">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.1 + index * 0.06,
                    }}
                    onClick={() => scrollToSection(link.href)}
                    className="group relative"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -5 - (index % 3) * 2, 0],
                        x: [0, (index % 2 === 0 ? 2 : -2), 0],
                      }}
                      transition={{
                        duration: 5 + index * 0.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.4,
                      }}
                    >
                      <span className="text-xl text-muted-foreground/80 hover:text-foreground transition-colors duration-300">
                        {link.label}
                      </span>
                      <motion.div 
                        className="absolute -bottom-1 left-0 right-0 h-px bg-primary/40"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </motion.button>
                ))}
              </nav>

              {/* CTA Button - floating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mt-12"
              >
                <motion.div
                  animate={{ 
                    y: [0, -6, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Button asChild size="lg" className="h-12 px-8 text-base">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
