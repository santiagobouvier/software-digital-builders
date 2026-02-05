import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check for user preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Check if mobile
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    
    setShouldReduceMotion(prefersReducedMotion || isMobile);

    const handleResize = () => {
      const isMobileNow = window.innerWidth < MOBILE_BREAKPOINT;
      setShouldReduceMotion(prefersReducedMotion || isMobileNow);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return shouldReduceMotion;
}
