import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > 300);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 24 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.12, y: -2 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll to top"
            className="group relative flex h-13 w-13 items-center justify-center rounded-full border-2 border-border/80 bg-surface/90 text-ink backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-accent hover:bg-surface hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:shadow-[0_0_24px_rgba(255,160,0,0.3)]"
          >
            {/* SVG Circular Progress Ring */}
            <svg
              className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 52 52"
            >
              {/* Subtle background track circle */}
              <circle
                cx="26"
                cy="26"
                r="22"
                className="stroke-muted/30"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Dynamic scroll progress circle */}
              <motion.circle
                cx="26"
                cy="26"
                r="22"
                className="stroke-accent"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                style={{
                  pathLength: smoothProgress,
                }}
              />
            </svg>

            {/* Up Arrow Icon with springy hover animation */}
            <ArrowUp
              className="h-5 w-5 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110"
              strokeWidth={2.5}
            />

            {/* Tooltip on Hover */}
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-surface/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-top-11 backdrop-blur-md">
              Scroll to top
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
