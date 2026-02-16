import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, ClipboardList, Brain, Users, RefreshCw, HelpCircle, MessageCircle, FileSearch, GraduationCap, X, Check } from "lucide-react";

interface ServiceBotInternoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { icon: ClipboardList, title: "Definimos qué necesita tu equipo", desc: "Procesos, preguntas frecuentes, documentos, políticas, servicios." },
  { icon: Brain, title: "Cargamos el conocimiento y reglas", desc: "El bot se entrena con tu información real (ordenada)." },
  { icon: Users, title: "Tu equipo consulta y resuelve al instante", desc: "Sin interrumpir a administración, ventas o soporte." },
  { icon: RefreshCw, title: "Se mejora con el uso", desc: "Ajustamos respuestas, agregamos info y evolucionamos el sistema." },
];

const resolves = [
  { icon: HelpCircle, text: "\"¿Cómo se hace X en la empresa?\"" },
  { icon: MessageCircle, text: "\"¿Qué decirle a un cliente en tal caso?\"" },
  { icon: FileSearch, text: "\"¿Dónde está tal documento o procedimiento?\"" },
  { icon: GraduationCap, text: "Capacitación para nuevos integrantes" },
];

const noEs = [
  "Un chat genérico sin contexto",
  "Un bot público para clientes",
  "Un PDF que nadie lee",
];

const siEs = [
  "Un asistente interno real",
  "Con reglas y procesos de tu empresa",
  "Que ahorra tiempo todos los días",
];

export const ServiceBotInternoDialog = ({ open, onOpenChange }: ServiceBotInternoDialogProps) => {
  const scrollToContact = () => {
    onOpenChange(false);
    setTimeout(() => {
      document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-background border-border">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold">Bots internos para empresas</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm sm:text-base">
            Un asistente privado que responde dudas internas, guía procesos y capacita al equipo.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          {/* ¿Qué es? */}
          <div>
            <h3 className="text-lg font-semibold mb-2">¿Qué es?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Un bot interno (no público) que vive dentro de tu empresa y sirve como "manual inteligente": responde preguntas del equipo, explica procedimientos y organiza información.
            </p>
          </div>

          {/* ¿Cómo funciona? */}
          <div>
            <h3 className="text-lg font-semibold mb-4">¿Cómo funciona?</h3>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{`${i + 1}. ${step.title}`}</p>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ¿Qué resuelve? */}
          <div>
            <h3 className="text-lg font-semibold mb-3">¿Qué resuelve?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resolves.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diferencia */}
          <div>
            <h3 className="text-lg font-semibold mb-3">¿En qué se diferencia?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                <p className="font-medium text-sm text-destructive">❌ No es</p>
                {noEs.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="font-medium text-sm text-primary">✅ Sí es</p>
                {siEs.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Para quién */}
          <div>
            <h3 className="text-lg font-semibold mb-2">¿Para quién es?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empresas con equipo, tareas repetitivas, soporte interno, ventas o procesos que hoy dependen de "preguntarle a alguien".
            </p>
          </div>

        </div>

        <div className="p-4 border-t border-border/50 shrink-0">
          <Button className="w-full" size="lg" onClick={scrollToContact}>
            Quiero un bot interno para mi empresa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
