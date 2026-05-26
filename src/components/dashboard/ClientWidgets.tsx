import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ClientWidgetsProps {
  userId: string;
}

export const ClientWidgets = ({ userId: _userId }: ClientWidgetsProps) => {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">Bienvenido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">
            Tu administrador te dará acceso cuando esté todo listo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
