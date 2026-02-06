import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface AnimatedSidebarTriggerProps {
  className?: string;
}

export function AnimatedSidebarTrigger({ className }: AnimatedSidebarTriggerProps) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  
  // Use the correct open state based on device
  const isOpen = isMobile ? openMobile : open;

  const lineVariants = {
    closed: {
      rotate: 0,
      y: 0,
      opacity: 1,
    },
    open: {
      rotate: 0,
      y: 0,
      opacity: 1,
    },
  };

  const topLineVariants = {
    closed: {
      rotate: 0,
      y: 0,
      width: "100%",
    },
    open: {
      rotate: 45,
      y: 6,
      width: "100%",
    },
  };

  const middleLineVariants = {
    closed: {
      opacity: 1,
      x: 0,
      width: "70%",
    },
    open: {
      opacity: 0,
      x: -10,
      width: "70%",
    },
  };

  const bottomLineVariants = {
    closed: {
      rotate: 0,
      y: 0,
      width: "85%",
    },
    open: {
      rotate: -45,
      y: -6,
      width: "100%",
    },
  };

  const containerVariants = {
    closed: {
      rotate: 0,
    },
    open: {
      rotate: 180,
    },
  };

  return (
    <motion.button
      onClick={toggleSidebar}
      className={cn(
        "relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md",
        "bg-transparent hover:bg-accent/80 transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "group",
        className
      )}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={containerVariants}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      aria-label="Toggle navigation"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-md bg-primary/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Lines container */}
      <div className="relative flex h-4 w-5 flex-col items-start justify-center gap-[5px]">
        {/* Top line */}
        <motion.span
          className="h-[2px] rounded-full bg-foreground origin-center"
          variants={topLineVariants}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ width: "100%" }}
        />

        {/* Middle line */}
        <motion.span
          className="h-[2px] rounded-full bg-primary origin-left"
          variants={middleLineVariants}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          style={{ width: "70%" }}
        />

        {/* Bottom line */}
        <motion.span
          className="h-[2px] rounded-full bg-foreground origin-center"
          variants={bottomLineVariants}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.05,
          }}
          style={{ width: "85%" }}
        />
      </div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-md"
        whileTap={{
          boxShadow: "0 0 0 4px hsl(var(--primary) / 0.2)",
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}
