import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 1. Instant response trailing for the main point dot (no feelable click-lag)
  const directX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const directY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

  // 2. Smooth trailing spring physics for the outer glowing aura and rings
  const springX = useSpring(mouseX, { stiffness: 350, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 350, damping: 28 });

  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isHoveringInput, setIsHoveringInput] = useState(false);
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

      const target = e.target as HTMLElement | null;
      if (target) {
        // Detect interactive elements (links, buttons, action elements)
        const isInteractive = Boolean(
          target.closest(
            'a, button, input, select, textarea, [role="button"], [data-cursor="interactive"]'
          )
        );
        setIsHoveringInteractive(isInteractive);

        // Detect text inputs specifically for typing mode
        const isTextInput = Boolean(
          target.closest(
            'input[type="text"], input[type="email"], input[type="search"], input[type="password"], input[type="url"], input[type="number"], input[type="tel"], textarea, [contenteditable="true"]'
          ) || (target.tagName === 'INPUT' && !['submit', 'button', 'checkbox', 'radio', 'file', 'image', 'range', 'color'].includes((target as HTMLInputElement).type))
        );
        setIsHoveringInput(isTextInput);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHoveringInteractive(false);
      setIsHoveringInput(false);
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
      {/* A. Outer Ring: Thin, clean circle that lags behind smoothly */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
        style={{
          left: springX,
          top: springY,
          width: 22,
          height: 22,
        }}
        animate={{
          scale: isHoveringInput ? 0 : isMouseDown ? 0.65 : isHoveringInteractive ? 1.4 : 1,
          opacity: isHoveringInput ? 0 : 0.7,
          borderColor: isHoveringInteractive ? "#ff5a1f" : "#39d353",
          boxShadow: isHoveringInteractive 
            ? "0 0 8px rgba(255, 90, 31, 0.2)"
            : "0 0 8px rgba(57, 211, 83, 0.2)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* B. Core Dot / Blinking Terminal Typing Line */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: directX,
          top: directY,
        }}
        animate={{
          scale: isMouseDown ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 28 }}
      >
        {isHoveringInput ? (
          /* Small, clean green blinking typing cursor line */
          <motion.div
            animate={{
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: (t) => (t < 0.5 ? 0 : 1),
            }}
            className="w-[2px] h-3.5 bg-[#39d353] shadow-[0_0_6px_#39d353]"
          />
        ) : (
          /* Simple small core dot that swaps color on hover */
          <motion.div
            animate={{
              scale: isHoveringInteractive ? 1.1 : 1,
            }}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              isHoveringInteractive 
                ? "bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" 
                : "bg-[#39d353] shadow-[0_0_8px_#39d353]"
            }`}
          />
        )}

        {/* Click Shockwave (Simple, elegant circular pulse) */}
        <AnimatePresence>
          {isMouseDown && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute h-5 w-5 rounded-full border border-[#ff5a1f]/60"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
