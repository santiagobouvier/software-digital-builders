import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientAvatarProps {
  logoUrl?: string | null;
  companyName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export const ClientAvatar = ({ logoUrl, companyName, size = "md", className }: ClientAvatarProps) => {
  const initials = companyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar className={cn(sizeClasses[size], "rounded-lg", className)}>
      {logoUrl ? (
        <AvatarImage src={logoUrl} alt={companyName} className="object-cover" />
      ) : null}
      <AvatarFallback className="rounded-lg bg-muted">
        {initials || <Building2 className={iconSizes[size]} />}
      </AvatarFallback>
    </Avatar>
  );
};
