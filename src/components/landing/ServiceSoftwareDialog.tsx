import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardList, Boxes, ShieldCheck, TrendingUp, Users, LayoutDashboard, ListTodo, Zap, BarChart3, Plug, X, Check } from "lucide-react";

interface ServiceSoftwareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { icon: ClipboardList, title: "Relevamos tu proceso actual", desc: "Cómo trabajan hoy, dónde se pierde tiempo y qué hay que ordenar." },
  { icon: Boxes, title: "Diseñamos el sistema por módulos", desc: "Empezamos por lo esencial y escalamos con el tiempo." },
  { icon: ShieldCheck, title: "Implementamos con usuarios y permisos", desc: "Cada persona ve lo que tiene que ver." },
  { icon: TrendingUp, title: "Métricas y mejoras continuas", desc: "El sistema evoluciona con tu negocio." },
];

const includes = [
  { icon: Users, text: "CRM + pipeline comercial" },
  { icon: LayoutDashboard, text: "Panel de clientes / portal" },
  { icon: ListTodo, text: "Gestión de tareas / operaciones" },
  { icon: Zap, text: "Automatizaciones (mensajes, emails, recordatorios)" },
  { icon: BarChart3, text: "Dashboard de métricas" },
  { icon: Plug, text: "Integraciones (pagos, formularios, APIs)" },
];

const noEs = [
  "Un sistema genérico que te obliga a adaptarte",
  "Un desarrollo \"eterno\" sin foco",
  "Una herramienta sin soporte",
];

const siEs = [
  "Software hecho para tu forma de trabajar",
  "Modular, escalable, y vendible por etapas",
  "Pensado para automatizar y ahorrar tiempo",
];

export const ServiceSoftwareDialog = ({ open, onOpenChange }: ServiceSoftwareDialogProps) => {
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
          <DialogTitle className="text-xl sm:text-2xl font-bold">Software y sistemas a medida</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm sm:text-base">
            Cuando tu empresa necesita algo más que una web: un sistema que ordene, automatice y escale.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">¿Qué es?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Un sistema diseñado para tu operación real: gestión de clientes, ventas, tareas, procesos, paneles, automatizaciones y usuarios con permisos.
            </p>
          </div>

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

          <div>
            <h3 className="text-lg font-semibold mb-3">¿Qué puede incluir?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {includes.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

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

          <div>
            <h3 className="text-lg font-semibold mb-2">¿Para quién es?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empresas que ya tienen flujo real y necesitan orden, control y escalabilidad.
            </p>
          </div>

        </div>

        <div className="p-4 border-t border-border/50 shrink-0">
          <Button className="w-full" size="lg" onClick={scrollToContact}>
            Quiero un sistema a medida
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
