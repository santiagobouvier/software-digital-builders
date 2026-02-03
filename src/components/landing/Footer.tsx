import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="py-10 border-t border-border/30 bg-background relative overflow-hidden">
      {/* Subtle top glow */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.2, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px]"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.2) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <Logo size="sm" />
            <div className="hidden sm:block w-px h-6 bg-border/50" />
            <span className="hidden sm:block text-xs text-muted-foreground">
              Plataforma SaaS de Automatización
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-6 text-sm text-muted-foreground"
          >
            <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              <Link to="/login" className="hover:text-foreground transition-colors">
                Acceder
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              <a href="mailto:contacto@digitalbuilders.net" className="hover:text-foreground transition-colors">
                Contacto
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 pt-6 border-t border-border/20 text-center"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground"
          >
            © {new Date().getFullYear()} Digital Builders. Todos los derechos reservados.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};
