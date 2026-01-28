import { Bot, Users, Plus, ArrowRight } from "lucide-react";
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
  hasBots: boolean;
  hasUsers: boolean;
}

export const EmptyDashboard = ({ 
  isProfessional, 
  hasCompany, 
  hasBots,
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
          id: "bot",
          title: "Crear tu primer bot",
          description: "Configurá un bot para empezar a recibir métricas",
          completed: hasBots,
          action: () => navigate("/bots"),
          actionLabel: "Crear bot",
        },
        {
          id: "users",
          title: "Agregar usuarios (opcional)",
          description: "Invitá clientes para que vean sus métricas",
          completed: hasUsers,
          action: () => navigate("/users"),
          actionLabel: "Gestionar usuarios",
        },
      ]
    : [
        {
          id: "access",
          title: "Acceso configurado",
          description: "Ya tenés acceso a tus bots asignados",
          completed: hasBots,
        },
      ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            ¡Bienvenido a Digital Builders Bots!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isProfessional
              ? "Configurá tu primer bot para empezar a recibir métricas de tus conversaciones."
              : "Cuando tu administrador te asigne bots, podrás ver sus métricas aquí."}
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

      {/* Onboarding Steps */}
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

      {/* Quick Actions for Professional */}
      {isProfessional && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/bots")} className="gap-2">
                <Bot className="h-4 w-4" />
                Ir a Bots
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
