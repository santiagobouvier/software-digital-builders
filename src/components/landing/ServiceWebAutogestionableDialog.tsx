import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, PenLine, LayoutTemplate, Headphones, FileText, Layers, Star, FolderOpen, X, Check } from "lucide-react";

interface ServiceWebAutogestionableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { icon: Smartphone, title: "Armamos la web + el panel de gestión", desc: "Diseño completo y un administrador hecho para tu necesidad." },
  { icon: LayoutTemplate, title: "Te dejamos plantillas listas", desc: "Estructuras claras para que no rompas el diseño al editar." },
  { icon: PenLine, title: "Vos editás cuando quieras", desc: "Cambios en minutos: textos, fotos, artículos, novedades." },
  { icon: Headphones, title: "Soporte para ajustes y mejoras", desc: "Si querés nuevas secciones, automatizaciones o funciones, se escala." },
];

const manageItems = [
  { icon: FileText, text: "Blog / noticias / novedades" },
  { icon: Layers, text: "Secciones del sitio (servicios, textos, imágenes)" },
  { icon: Star, text: "Contenido destacado (home)" },
  { icon: FolderOpen, text: "Archivos y recursos (según plan)" },
];

const noEs = [
  "Un WordPress lleno de plugins",
  "Un panel confuso y pesado",
  "Algo que requiere \"saber sistemas\"",
];

const siEs = [
  "Un administrador simple y directo",
  "Diseñado para que edites sin romper nada",
  "Una web que crece con tu negocio",
];

export const ServiceWebAutogestionableDialog = ({ open, onOpenChange }: ServiceWebAutogestionableDialogProps) => {
  const scrollToContact = () => {
    onOpenChange(false);
    setTimeout(() => {
      document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-background border-border">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/50 shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold">Páginas web autogestionables</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm sm:text-base">
            Tu web con panel para editar contenidos, blog y secciones sin depender de nadie.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          {/* ¿Qué es? */}
          <div>
            <h3 className="text-lg font-semibold mb-2">¿Qué es?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Una web profesional + un panel privado donde vos (o tu equipo) puede actualizar contenido: textos, imágenes, novedades, servicios, etc.
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

          {/* ¿Qué podés gestionar? */}
          <div>
            <h3 className="text-lg font-semibold mb-3">¿Qué podés gestionar?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {manageItems.map((item, i) => (
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
              Empresas que quieren independencia para actualizar contenido, publicar novedades o mantener la web viva sin depender de un programador.
            </p>
          </div>

        </div>

        {/* Fixed footer */}
        <div className="p-4 border-t border-border/50 shrink-0">
          <Button className="w-full" size="lg" onClick={scrollToContact}>
            Quiero una web autogestionable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
