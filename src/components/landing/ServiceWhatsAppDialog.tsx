import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, XCircle, ArrowRight, Users, DollarSign } from "lucide-react";

interface ServiceWhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { emoji: "1️⃣", title: "El cliente escribe por WhatsApp", desc: "Envía un mensaje como \"Hola\", \"Quiero información\" o cualquier consulta. El chatbot se activa al instante." },
  { emoji: "2️⃣", title: "El chatbot entiende la consulta y responde", desc: "Interpreta lo que el cliente necesita y le entrega información clara, organizada y personalizada según tu negocio." },
  { emoji: "3️⃣", title: "Filtra y ordena clientes reales", desc: "Separa curiosos de interesados reales. Captura datos clave como nombre, ubicación y presupuesto." },
  { emoji: "4️⃣", title: "Deriva a humano con contexto cuando hace falta", desc: "Cuando el cliente necesita atención personalizada, el bot pasa la conversación a tu equipo — con todo el contexto listo." },
];

const benefits = [
  "Responde consultas frecuentes",
  "Filtra clientes interesados",
  "Captura datos clave",
  "Reduce tiempo perdido",
  "Funciona 24/7 sin pausa",
  "Se adapta a cada negocio",
  "No reemplaza personas, las potencia",
];

const notIs = [
  "Un bot rígido con respuestas fijas",
  "Un menú de opciones genérico",
  "Un flujo copiado de plantilla",
];

const yesIs = [
  "Un chatbot personalizado para tu rubro",
  "Diseñado según cómo vende tu empresa",
  "Ajustable y mejorable con el tiempo",
  "Configurado por personas reales",
];

const WHATSAPP_URL = "https://wa.me/5491164460740?text=Hola%2C%20quiero%20un%20chatbot%20para%20mi%20negocio";

export const ServiceWhatsAppDialog = ({ open, onOpenChange }: ServiceWhatsAppDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-background border-border/60">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">Chatbots inteligentes para WhatsApp</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            Atienden clientes, filtran consultas, capturan datos y derivan a tu equipo solo cuando vale la pena.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          {/* ¿Qué es? */}
          <section>
            <h3 className="text-lg font-semibold mb-2">¿Qué es?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Un chatbot diseñado específicamente para tu negocio. No es un menú rígido ni un bot genérico. Es un asistente digital que conversa, pregunta y guía a tus clientes hacia la información que necesitan — o directamente hacia tu equipo de ventas.
            </p>
          </section>

          {/* ¿Cómo funciona? */}
          <section>
            <h3 className="text-lg font-semibold mb-4">¿Cómo funciona?</h3>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{step.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Por dentro combinamos flujos, lógica inteligente y reglas personalizadas para cada negocio.
            </p>
          </section>

          {/* ¿Qué hace? */}
          <section>
            <h3 className="text-lg font-semibold mb-3">¿Qué hace el chatbot por tu negocio?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Diferenciación */}
          <section>
            <h3 className="text-lg font-semibold mb-3">¿En qué se diferencia?</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="font-semibold text-sm text-destructive mb-2">❌ No es</p>
                <ul className="space-y-1.5">
                  {notIs.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-3.5 w-3.5 text-destructive/60 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="font-semibold text-sm text-primary mb-2">✅ Sí es</p>
                <ul className="space-y-1.5">
                  {yesIs.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary/60 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ¿Para quién es? */}
          <section>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> ¿Para quién es?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ideal para PyMEs que reciben muchas consultas por WhatsApp y necesitan ordenar la atención sin perder oportunidades. Si tu equipo pierde tiempo respondiendo siempre lo mismo, este chatbot es para vos.
            </p>
          </section>

          {/* Inversión */}
          <section className="rounded-xl border border-border/40 bg-card/60 p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" /> Inversión
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">Chatbots desde USD 80/mes</span></p>
              <p>Setup inicial según el negocio</p>
              <p className="text-xs italic mt-2">Cada chatbot se adapta al volumen y complejidad de tu empresa.</p>
            </div>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Consultar por precios
              </a>
            </Button>
          </section>
        </div>

        {/* Fixed footer CTA */}
        <div className="p-6 pt-4 border-t border-border/30 shrink-0 space-y-2">
          <p className="text-sm font-medium text-center">
            Convertí WhatsApp en un canal de ventas ordenado
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Dejá de perder consultas. Automatizá la atención y cerrá más ventas.
          </p>
          <Button className="w-full" size="lg" asChild>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Quiero un chatbot para mi negocio <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
