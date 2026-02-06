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
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  if (iconOnly) {
    // Show a circular cropped version of the logo
    return (
      <div
        className={`${iconSizeClasses[size]} rounded-lg overflow-hidden flex items-center justify-center bg-sidebar-accent/50 ${className}`}
      >
        <img
          src={logo}
          alt="Digital Builders"
          className="h-full w-full object-cover scale-150"
        />
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
