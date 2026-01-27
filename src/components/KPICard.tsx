import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "cyan" | "green" | "yellow" | "red" | "default";
}

export const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "default",
}: KPICardProps) => {
  const colorClasses = {
    cyan: "text-primary",
    green: "text-success",
    yellow: "text-warning",
    red: "text-destructive",
    default: "text-muted-foreground",
  };

  const bgColorClasses = {
    cyan: "bg-primary/10",
    green: "bg-success/10",
    yellow: "bg-warning/10",
    red: "bg-destructive/10",
    default: "bg-muted/50",
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {trend && (
              <p
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-success" : "text-destructive"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}% vs ayer
              </p>
            )}
          </div>
          <div
            className={`p-3 rounded-xl ${bgColorClasses[color]} ${colorClasses[color]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
