import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Settings, Bot, Building2, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    icon: Globe,
    title: "Páginas web rápidas",
    description: "Desarrollo de páginas web institucionales profesionales en tiempos muy reducidos.",
  },
  {
    icon: Settings,
    title: "Páginas web autogestionables",
    description: "Webs con acceso a un sistema para editar y gestionar contenidos de forma independiente.",
  },
  {
    icon: Bot,
    title: "Bots para WhatsApp",
    description: "Automatización de atención y consultas por WhatsApp para empresas.",
  },
  {
    icon: Bot,
    title: "Bots para Instagram",
    description: "Respuesta automática y organización de mensajes en Instagram.",
  },
  {
    icon: Bot,
    title: "Bots internos para empresas",
    description: "Bots privados para capacitación, soporte interno o uso del equipo.",
  },
  {
    icon: Code2,
    title: "Software y sistemas a medida",
    description: "Desarrollo de soluciones técnicas personalizadas para empresas con necesidades específicas.",
  },
];

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const Icon = product.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative"
    >
      <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-card/80 hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/0 group-hover:border-primary/60 rounded-tl-2xl transition-all duration-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/0 group-hover:border-primary/60 rounded-br-2xl transition-all duration-500" />
        
        {/* Icon container */}
        <div className="relative mb-5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-500 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110 group-hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]">
            <Icon className="w-6 h-6 text-primary transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 transition-colors duration-300 group-hover:text-primary">
          {product.title}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {product.description}
        </p>
        
        {/* Bottom line accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-3/4 transition-all duration-500" />
      </div>
    </motion.div>
  );
};

export const ProductsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scrollToContact = () => {
    const element = document.querySelector("#contacto");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="productos" 
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(var(--primary)/0.03),transparent)]" />
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.03) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Lo que hacemos</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Productos
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluciones tecnológicas prácticas para empresas.
          </p>
          
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {products.map((product, index) => (
            <ProductCard key={product.title} product={product} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <div className="relative inline-block">
            {/* Glow background */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-50" />
            
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sm:p-10">
              <p className="text-lg sm:text-xl text-muted-foreground mb-6">
                ¿Querés una solución adaptada a tu empresa?
              </p>
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="relative overflow-hidden group px-8 py-6 text-base font-semibold"
              >
                <span className="relative z-10">Contactar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
