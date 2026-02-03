import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (en producción conectar con backend)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Mensaje enviado",
      description: "Te contactaremos pronto.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contacto" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/5" />

      {/* Static glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-15"
        style={{
          background: "radial-gradient(ellipse at center, hsl(187 100% 50% / 0.2) 0%, transparent 60%)",
        }}
      />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Contacto
          </h2>
          <p className="text-muted-foreground">
            ¿Tenés un proyecto en mente? Hablemos.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Tu nombre"
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Contanos sobre tu proyecto..."
                    rows={4}
                    required
                    className="bg-background/50 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar mensaje
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/5491123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors duration-200">
                      WhatsApp
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Escribinos directamente
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Email */}
            <a
              href="mailto:contacto@digitalbuilders.net"
              className="group"
            >
              <Card className="bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors duration-200">
                      Email
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      contacto@digitalbuilders.net
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Info text */}
            <div className="mt-auto p-4 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Respondemos en menos de 24 horas hábiles. Contanos tu idea y te
                asesoramos sobre la mejor solución para tu negocio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
