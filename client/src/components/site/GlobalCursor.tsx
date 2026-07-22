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
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* A. Outer Spotlight (Smooth lag-follow + shifts colors to ultra-vibrant neon gradients on hover) */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-500"
        style={{
          left: springX,
          top: springY,
          width: 140,
          height: 140,
          background: isHoveringInteractive
            ? "radial-gradient(circle at center, rgba(255, 0, 127, 0.45) 0%, rgba(255, 235, 59, 0.2) 45%, transparent 75%)"
            : "radial-gradient(circle at center, rgba(0, 255, 204, 0.38) 0%, rgba(168, 85, 247, 0.18) 45%, transparent 75%)",
          filter: "blur(24px)",
        }}
      />

      {/* B. Outer Neon Glow Ring (Smooth lag-follow + accelerated spin on hover) */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: springX,
          top: springY,
        }}
        animate={{
          scale: isMouseDown ? 0.75 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <motion.div
          animate={{
            rotate: [0, 180, 360],
          }}
          transition={{
            rotate: {
              duration: isHoveringInteractive ? 2 : 7,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className={`absolute h-9 w-9 rounded-full border border-white/30 bg-gradient-to-tr transition-all duration-300 opacity-90 blur-[0.5px] ${
            isHoveringInteractive
              ? "from-[#ff007f] via-[#ff5722] to-[#ffeb3b] shadow-[0_0_22px_rgba(255,0,127,0.7)]"
              : "from-[#00ffcc] via-[#38bdf8] to-[#a855f7] shadow-[0_0_15px_rgba(0,255,204,0.55)]"
          }`}
        />

        <div className="relative flex h-7.5 w-7.5 items-center justify-center rounded-full border border-white/20 bg-surface/40 backdrop-blur-md" />
      </motion.div>

      {/* C. Instant Core Point Dot (Lag-free exact position indicator for precise clicks) */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: directX,
          top: directY,
        }}
        animate={{
          scale: isMouseDown ? 0.65 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        {/* Core clickable center dot */}
        <motion.div
          animate={
            isHoveringInteractive
              ? { scale: [1, 1.35, 1] }
              : { scale: 1 }
          }
          transition={
            isHoveringInteractive
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
          className={`h-2.5 w-2.5 rounded-full border border-black/20 shadow-md transition-all duration-300 ${
            isHoveringInteractive
              ? "bg-gradient-to-r from-[#ff007f] to-[#ffeb3b] shadow-[0_0_12px_#ff007f]"
              : "bg-gradient-to-r from-[#00f5ff] to-[#00ff66] shadow-[0_0_8px_#00f5ff]"
          }`}
        />

        {/* Click Shockwave Wave Effect */}
        <AnimatePresence>
          {isMouseDown && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute h-8 w-8 rounded-full border-2 border-[#ff007f]"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
