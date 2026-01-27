import logo from "@/assets/logo-digitalbuilders.webp";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  return (
    <img
      src={logo}
      alt="Digital Builders"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
};
