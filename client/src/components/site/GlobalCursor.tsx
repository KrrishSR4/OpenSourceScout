import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 1. Instant response trailing for the main point dot (ultra-fast & responsive)
  const directX = useSpring(mouseX, { stiffness: 1600, damping: 65 });
  const directY = useSpring(mouseY, { stiffness: 1600, damping: 65 });

  // 2. Snappy spring physics for the outer target ring
  const springX = useSpring(mouseX, { stiffness: 750, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 750, damping: 40 });

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
      {/* A. Outer Ring: Thin, clean circle that tracks snappily with high-contrast dual-outline */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90"
        style={{
          left: springX,
          top: springY,
          width: 22,
          height: 22,
        }}
        animate={{
          scale: isHoveringInput ? 0 : isMouseDown ? 0.65 : isHoveringInteractive ? 1.4 : 1,
          opacity: isHoveringInput ? 0 : 0.95,
          borderColor: isHoveringInteractive ? "#ff5a1f" : "#00f0ff",
          boxShadow: isHoveringInteractive 
            ? "0 0 0 1px rgba(0, 0, 0, 0.7), 0 0 12px rgba(255, 90, 31, 0.4)"
            : "0 0 0 1px rgba(0, 0, 0, 0.7), 0 0 12px rgba(0, 240, 255, 0.4)",
        }}
        transition={{ type: "spring", stiffness: 750, damping: 40 }}
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
        transition={{ type: "spring", stiffness: 1600, damping: 65 }}
      >
        {isHoveringInput ? (
          /* Small, clean cyan blinking typing cursor line with high-contrast dark border */
          <motion.div
            animate={{
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: (t) => (t < 0.5 ? 0 : 1),
            }}
            className="w-[2px] h-3.5 bg-[#00f0ff] border border-black/40 shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_0_6px_#00f0ff]"
          />
        ) : (
          /* Simple small core dot with high-contrast dual-outline (visible on dark and light screens) */
          <motion.div
            animate={{
              scale: isHoveringInteractive ? 1.15 : 1,
            }}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 border border-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.75),0_0_8px_currentColor] ${
              isHoveringInteractive 
                ? "bg-[#ff5a1f] text-[#ff5a1f]" 
                : "bg-[#00f0ff] text-[#00f0ff]"
            }`}
          />
        )}

        {/* Click Feedback: Shockwave and 6-particle supernova burst */}
        <AnimatePresence>
          {isMouseDown && (
            <>
              {/* Expanding Ring */}
              <motion.span
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
                className="absolute h-5 w-5 rounded-full border border-[#ff5a1f]/70 shadow-[0_0_6px_rgba(255,90,31,0.3)]"
              />
              {/* Supernova Particles Burst */}
              {[
                { x: 0, y: -22 },
                { x: 19, y: -11 },
                { x: 19, y: 11 },
                { x: 0, y: 22 },
                { x: -19, y: 11 },
                { x: -19, y: -11 },
              ].map((p, i) => (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 0.95 }}
                  animate={{ x: p.x, y: p.y, scale: 0.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.42, ease: "easeOut" }}
                  className={`absolute h-1 w-1 rounded-full ${
                    isHoveringInteractive ? "bg-[#00f0ff]" : "bg-[#ff5a1f]"
                  } shadow-[0_0_4px_currentColor]`}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
