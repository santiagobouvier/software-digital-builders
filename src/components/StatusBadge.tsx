import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "paused" | "error";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    active: {
      label: "Activo",
      classes: "bg-success/20 text-success border-success/30",
      dotClass: "bg-success animate-pulse",
    },
    paused: {
      label: "Pausado",
      classes: "bg-muted text-muted-foreground border-border",
      dotClass: "bg-muted-foreground",
    },
    error: {
      label: "Error",
      classes: "bg-destructive/20 text-destructive border-destructive/30",
      dotClass: "bg-destructive animate-pulse",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
};
