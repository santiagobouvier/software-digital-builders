import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";

interface PreloaderProps {
  isLoading: boolean;
}

export const Preloader = ({ isLoading }: PreloaderProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Starfield background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Static stars */}
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 2 + 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Nebula glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20"
              style={{
                background: "radial-gradient(circle, hsl(187 100% 50% / 0.3) 0%, transparent 60%)",
              }}
            />
            <div
              className="absolute top-1/3 left-1/4 w-[300px] h-[300px] opacity-10"
              style={{
                background: "radial-gradient(circle, hsl(260 80% 60% / 0.5) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Logo container with floating animation */}
          <div className="relative">
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 -m-8 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(187 100% 50% / 0.15) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Orbital ring */}
            <motion.div
              className="absolute inset-0 -m-12"
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/60"
                style={{ boxShadow: "0 0 10px hsl(187 100% 50% / 0.8)" }}
              />
            </motion.div>

            {/* Logo with float animation */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Logo size="lg" className="drop-shadow-[0_0_30px_hsl(187_100%_50%/0.4)]" />
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
