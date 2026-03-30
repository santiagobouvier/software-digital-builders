import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle2, XCircle, ArrowRight, Users } from "lucide-react";

interface ServiceWebRapidaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { emoji: "1️⃣", title: "Nos pasás tu info", desc: "Logo, textos, servicios, fotos y links (WhatsApp / redes / ubicación)." },
  { emoji: "2️⃣", title: "Diseñamos y armamos la web", desc: "Maquetación profesional, versión mobile, estética cuidada y clara." },
  { emoji: "3️⃣", title: "La dejamos publicada y funcionando", desc: "Dominio, hosting, correos si corresponde y todo conectado." },
  { emoji: "4️⃣", title: "Mantenimiento listo por si necesitás cambios", desc: "Si querés actualizar algo, lo pedís y lo resolvemos rápido." },
];

const includes = [
  "Web profesional (hasta 6–8 secciones/páginas)",
  "Diseño responsive (mobile + desktop)",
  "Botón de WhatsApp + redes sociales",
  "Google Maps + formulario de contacto",
  "Optimización básica de carga",
  "Publicación + configuración técnica",
];

const notIs = [
  "Un template genérico sin personalidad",
  "Una web lenta y desordenada",
  "Un \"sitio por cumplir\"",
];

const yesIs = [
  "Una web que transmite confianza",
  "Hecha para convertir visitas en consultas",
  "Rápida de entregar y fácil de escalar",
];

export const ServiceWebRapidaDialog = ({ open, onOpenChange }: ServiceWebRapidaDialogProps) => {
  const scrollToContact = () => {
    onOpenChange(false);
    setTimeout(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-background border-border/60">
        <DialogHeader className="p-6 pb-4 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">Páginas web rápidas</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            Web institucional profesional en pocos días, para que tu empresa se vea seria y confiable sin perder tiempo.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          <section>
            <h3 className="text-lg font-semibold mb-2">¿Qué es?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Una web moderna, simple y bien diseñada para mostrar tu negocio, tus servicios y cómo contactarte. Perfecta si hoy necesitás presencia online YA, sin paneles ni sistemas complejos.
            </p>
          </section>

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
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">¿Qué incluye?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {includes.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

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

          <section>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> ¿Para quién es?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              PyMEs y profesionales que venden servicios y quieren verse bien online sin complicarse.
            </p>
          </section>

        </div>

        <div className="p-6 pt-4 border-t border-border/30 shrink-0 space-y-2">
          <p className="text-sm font-medium text-center">
            Tu negocio merece verse profesional online
          </p>
          <p className="text-xs text-muted-foreground text-center">
            En pocos días tenés tu web lista para captar clientes.
          </p>
          <Button className="w-full" size="lg" asChild>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Quiero mi página web <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
