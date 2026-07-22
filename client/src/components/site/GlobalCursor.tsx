import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 1. Instant response trailing for the main point dot (no feelable click-lag)
  const directX = useSpring(mouseX, { stiffness: 1200, damping: 55 });
  const directY = useSpring(mouseY, { stiffness: 1200, damping: 55 });

  // 2. Smooth trailing spring physics for the outer glowing aura and rings
  const springX = useSpring(mouseX, { stiffness: 280, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 280, damping: 25 });

  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    // Hide custom cursor on touch/mobile devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    // Add active class to DOM to hide OS cursor globally
    document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Check if current target is an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'a, button, input, select, textarea, [role="button"], [data-cursor="interactive"]'
          )
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      document.documentElement.classList.remove("custom-cursor-active");
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      document.documentElement.classList.add("custom-cursor-active");
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* A. Outer Spotlight (Smooth lag-follow) */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: springX,
          top: springY,
          width: isHoveringInteractive ? 200 : 130,
          height: isHoveringInteractive ? 200 : 130,
          background:
            "radial-gradient(circle at center, rgba(192, 240, 0, 0.28) 0%, rgba(249, 115, 22, 0.16) 45%, transparent 75%)",
          filter: "blur(24px)",
        }}
      />

      {/* B. Outer Neon Glow Ring (Smooth lag-follow) */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: springX,
          top: springY,
        }}
        animate={{
          scale: isMouseDown ? 0.75 : isHoveringInteractive ? 1.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <motion.div
          animate={{
            rotate: [0, 180, 360],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          }}
          className="absolute h-10 w-10 rounded-full border border-white/30 bg-gradient-to-tr from-[var(--color-accent-2)] via-orange-400 to-[var(--color-accent-3)] opacity-70 blur-[1px] shadow-[0_0_15px_rgba(192,240,0,0.4)]"
        />

        <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-surface/30 backdrop-blur-md" />
      </motion.div>

      {/* C. Instant Core Point Dot (Lag-free exact position indicator for precise clicks) */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: directX,
          top: directY,
        }}
        animate={{
          scale: isMouseDown ? 0.6 : isHoveringInteractive ? 1.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        {/* Core clickable center dot */}
        <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)] border border-[var(--color-accent-2)]" />

        {/* Click Shockwave Wave Effect */}
        <AnimatePresence>
          {isMouseDown && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute h-8 w-8 rounded-full border-2 border-[var(--color-accent-2)]"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
