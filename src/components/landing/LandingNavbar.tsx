import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Sparkles, X, Globe, Bot, Shield, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Inicio", href: "#inicio", icon: Home },
  { label: "Plataforma", href: "#plataforma", icon: Globe },
  { label: "Servicios", href: "#servicios", icon: Bot },
  { label: "Seguridad", href: "#seguridad", icon: Shield },
  { label: "Contacto", href: "#contacto", icon: Mail },
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

  // Lock body scroll when menu is open
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
        
        {/* Bottom glow effect when scrolled */}
        <div 
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        />
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            {/* Background with blur and gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/98 backdrop-blur-xl"
            >
              {/* Animated glow orbs */}
              <motion.div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px]"
                style={{
                  background: "radial-gradient(circle, hsl(187 100% 50% / 0.15) 0%, transparent 60%)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px]"
                style={{
                  background: "radial-gradient(circle, hsl(260 80% 60% / 0.1) 0%, transparent 60%)",
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />

              {/* Grid pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                    linear-gradient(hsl(187 100% 50% / 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(187 100% 50% / 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px',
                }}
              />

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/40"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${15 + i * 12}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <X className="h-6 w-6 text-primary" />
            </motion.button>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center px-8">
              {/* Logo Icon Only - Floating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                className="mb-12 relative"
              >
                {/* Glow behind logo */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="w-40 h-40 rounded-full"
                    style={{
                      background: "radial-gradient(circle, hsl(187 100% 50% / 0.3) 0%, transparent 70%)",
                    }}
                  />
                </motion.div>

                {/* Orbiting ring */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-32 h-32 rounded-full border border-primary/20" />
                  <div className="absolute w-2 h-2 rounded-full bg-primary/60" style={{ transform: "translateX(64px)" }} />
                </motion.div>

                {/* Floating logo */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Logo size="lg" className="h-20 drop-shadow-2xl" />
                </motion.div>
              </motion.div>

              {/* Navigation Links */}
              <nav className="flex flex-col items-center gap-3 w-full max-w-xs">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.15 + index * 0.08,
                        type: "spring",
                        bounce: 0.3,
                      }}
                      onClick={() => scrollToSection(link.href)}
                      className="w-full group"
                    >
                      <motion.div 
                        className="flex items-center justify-center gap-4 py-4 px-6 rounded-xl border border-transparent bg-card/30 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="p-2 rounded-lg bg-primary/10 text-primary"
                          animate={{
                            y: [0, -3, 0],
                          }}
                          transition={{
                            duration: 2 + index * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>
                        <span className="text-lg font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                          {link.label}
                        </span>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </nav>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 w-full max-w-xs"
              >
                <Button asChild size="lg" className="w-full h-14 text-lg font-semibold relative overflow-hidden group">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Sparkles className="h-5 w-5" />
                      Entrar al sistema
                    </span>
                  </Link>
                </Button>
              </motion.div>

              {/* Footer text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-8 text-xs text-muted-foreground/50"
              >
                Powered by Digital Builders
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
