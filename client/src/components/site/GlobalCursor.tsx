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
      {/* A. Outer Spotlight (Smooth lag-follow + shifts colors on hover) */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-500"
        style={{
          left: springX,
          top: springY,
          width: 140,
          height: 140,
          background: isHoveringInteractive
            ? "radial-gradient(circle at center, rgba(56, 189, 248, 0.35) 0%, rgba(236, 72, 153, 0.16) 45%, transparent 75%)"
            : "radial-gradient(circle at center, rgba(192, 240, 0, 0.28) 0%, rgba(249, 115, 22, 0.16) 45%, transparent 75%)",
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
          className={`absolute h-9 w-9 rounded-full border border-white/30 bg-gradient-to-tr transition-all duration-300 opacity-80 blur-[0.5px] ${
            isHoveringInteractive
              ? "from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_18px_rgba(56,189,248,0.6)]"
              : "from-[var(--color-accent-2)] via-orange-400 to-[var(--color-accent-3)] shadow-[0_0_12px_rgba(192,240,0,0.35)]"
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
              ? { scale: [1, 1.3, 1], backgroundColor: "#38bdf8" }
              : { scale: 1, backgroundColor: "#ffffff" }
          }
          transition={
            isHoveringInteractive
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
          className={`h-2.5 w-2.5 rounded-full border border-black/20 shadow-md ${
            isHoveringInteractive
              ? "shadow-[0_0_10px_#38bdf8]"
              : "shadow-[0_0_6px_rgba(255,255,255,0.8)]"
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
              className="absolute h-8 w-8 rounded-full border-2 border-cyan-400"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
