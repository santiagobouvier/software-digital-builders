import { AlertTriangle, BarChart3, Users, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const problems = [
  {
    icon: BarChart3,
    title: "Sin métricas centralizadas",
    description:
      "Los datos de tus bots están dispersos y no puedes medir rendimiento real ni tomar decisiones basadas en datos.",
  },
  {
    icon: Users,
    title: "Gestión manual de clientes",
    description:
      "Crear accesos, asignar bots y gestionar permisos es un proceso manual que consume tiempo y genera errores.",
  },
  {
    icon: CreditCard,
    title: "Facturación desorganizada",
    description:
      "Sin control de suscripciones ni visibilidad de ingresos recurrentes. Cobros manuales y seguimiento inexistente.",
  },
  {
    icon: AlertTriangle,
    title: "Falta de visibilidad operativa",
    description:
      "No sabes cuántos mensajes procesan tus bots, cuántos leads generan ni cuándo fallan hasta que el cliente reclama.",
  },
];

// Different entrance directions for each card
const cardVariants = [
  { initial: { opacity: 0, x: -60, rotate: -3 }, animate: { opacity: 1, x: 0, rotate: 0 } },
  { initial: { opacity: 0, y: -60, rotate: 2 }, animate: { opacity: 1, y: 0, rotate: 0 } },
  { initial: { opacity: 0, y: 60, rotate: -2 }, animate: { opacity: 1, y: 0, rotate: 0 } },
  { initial: { opacity: 0, x: 60, rotate: 3 }, animate: { opacity: 1, x: 0, rotate: 0 } },
];

export const ProblemsSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Subtle horizontal lines */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2 }}
        className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"
      />
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-[80%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"
      />

      {/* Corner accent */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute top-12 right-8 hidden sm:block"
      >
        <div className="w-16 h-16 border-r border-t border-border/30 rounded-tr-2xl" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Problemas que resolvemos
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Si trabajas con bots de automatización, probablemente enfrentas estos desafíos diarios.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={cardVariants[index].initial}
              whileInView={cardVariants[index].animate}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card
                variant="interactive"
                className="group bg-card/50 backdrop-blur-sm h-full"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.3 + index * 0.15,
                        type: "spring"
                      }}
                      className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center border border-destructive/20"
                    >
                      <problem.icon className="h-5 w-5 text-destructive" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
