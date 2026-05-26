import { Users, ArrowRight, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
  actionLabel?: string;
}

interface EmptyDashboardProps {
  isProfessional: boolean;
  hasCompany: boolean;
  hasUsers: boolean;
}

export const EmptyDashboard = ({
  isProfessional,
  hasCompany,
  hasUsers,
}: EmptyDashboardProps) => {
  const navigate = useNavigate();

  const steps: OnboardingStep[] = isProfessional
    ? [
        {
          id: "company",
          title: "Empresa creada",
          description: "Tu empresa está configurada",
          completed: hasCompany,
        },
        {
          id: "clients",
          title: "Cargá tus clientes",
          description: "Empezá a registrar clientes en el CRM",
          completed: false,
          action: () => navigate("/clientes"),
          actionLabel: "Ir a Clientes",
        },
        {
          id: "users",
          title: "Agregar usuarios (opcional)",
          description: "Invitá a tu equipo a la plataforma",
          completed: hasUsers,
          action: () => navigate("/users"),
          actionLabel: "Gestionar usuarios",
        },
      ]
    : [
        {
          id: "access",
          title: "Acceso configurado",
          description: "Tu administrador te dará acceso cuando esté todo listo",
          completed: false,
        },
      ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            ¡Bienvenido a Digital Builders Software!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isProfessional
              ? "Configurá tu cuenta para empezar a gestionar tus clientes y proyectos."
              : "Cuando tu administrador te asigne acceso, vas a poder ver tu información aquí."}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso de configuración</span>
              <span className="font-medium">{completedSteps} de {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card
            key={step.id}
            variant={step.completed ? "default" : "interactive"}
            className={step.completed ? "opacity-60" : ""}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    step.completed
                      ? "bg-success/20 text-success"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {step.completed ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  {step.action && !step.completed && (
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 h-auto"
                      onClick={step.action}
                    >
                      {step.actionLabel}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isProfessional && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/clientes")} className="gap-2">
                <Briefcase className="h-4 w-4" />
                Ir a Clientes
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/users")}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Gestionar usuarios
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
