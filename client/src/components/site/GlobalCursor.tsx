import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-response spring physics for smooth, lag-free trailing
  const smoothX = useSpring(mouseX, { stiffness: 350, damping: 28 });
  const smoothY = useSpring(mouseY, { stiffness: 350, damping: 28 });

  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    // Hide cursor on touch-only devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
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

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
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
      {/* 1. Compact Glowing Radial Spotlight Following Cursor */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: smoothX,
          top: smoothY,
          width: isHoveringInteractive ? 200 : 140,
          height: isHoveringInteractive ? 200 : 140,
          background:
            "radial-gradient(circle at center, rgba(192, 240, 0, 0.28) 0%, rgba(249, 115, 22, 0.16) 45%, transparent 75%)",
          filter: "blur(24px)",
        }}
      />

      {/* 2. Compact Visible Glowing Cursor Orb */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: smoothX,
          top: smoothY,
        }}
        animate={{
          scale: isMouseDown ? 0.75 : isHoveringInteractive ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Outer Pulsing Neon Aura Ring */}
        <motion.div
          animate={{
            rotate: [0, 180, 360],
            scale: isHoveringInteractive ? [1, 1.2, 1] : [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute h-10 w-10 rounded-full border border-white/30 bg-gradient-to-tr from-[var(--color-accent-2)] via-orange-400 to-[var(--color-accent-3)] opacity-80 blur-[2px] shadow-[0_0_15px_rgba(192,240,0,0.5)]"
        />

        {/* Crisp Glass Ring Container */}
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-surface/40 backdrop-blur-md shadow-lg">
          {/* Inner Bright Neon Core Dot */}
          <motion.div
            animate={{
              scale: isHoveringInteractive ? [1, 1.4, 1] : 1,
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-2)] shadow-[0_0_10px_var(--color-accent-2)]"
          />
        </div>

        {/* Click Shockwave Wave Effect */}
        <AnimatePresence>
          {isMouseDown && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 2.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute h-8 w-8 rounded-full border-2 border-[var(--color-accent-2)]"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
