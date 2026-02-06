import logo from "@/assets/logo-digitalbuilders.webp";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

export const Logo = ({ className = "", size = "md", iconOnly = false }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  const iconSizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  if (iconOnly) {
    // Show only a circular icon version
    return (
      <div
        className={`${iconSizeClasses[size]} rounded-md bg-primary/20 flex items-center justify-center text-primary font-bold ${className}`}
      >
        D
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt="Digital Builders"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
};
