import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { useState } from "react";

export function ScrollToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [percent, setPercent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 250);
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPercent(Math.round(latest * 100));
  });

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => setIsClicked(false), 900);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 30 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-7 right-7 z-50 flex items-center justify-center"
        >
          <motion.button
            onClick={scrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.14, y: -4 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-surface/90 text-ink backdrop-blur-2xl shadow-2xl transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            {/* Ambient Animated Glow Aura */}
            <motion.div
              animate={{
                opacity: isHovered ? [0.4, 0.7, 0.4] : 0.2,
                scale: isHovered ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 blur-md pointer-events-none"
            />

            {/* Glass Background Inner Container */}
            <div className="absolute inset-0.5 rounded-full bg-surface/95 backdrop-blur-xl border border-white/10 group-hover:border-amber-500/40 transition-colors duration-300 pointer-events-none" />

            {/* Click Ripple Shockwave Effect */}
            {isClicked && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
              />
            )}

            {/* SVG Circular Progress Ring with Gradient */}
            <svg
              className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-1 z-10"
              viewBox="0 0 56 56"
            >
              <defs>
                <linearGradient id="scrollProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-muted/20"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Dynamic Scroll Progress Circle */}
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                stroke="url(#scrollProgressGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{
                  pathLength: smoothProgress,
                }}
              />
            </svg>

            {/* Animated Icon Container */}
            <div className="relative z-20 flex items-center justify-center">
              <motion.div
                animate={
                  isClicked
                    ? { y: -28, opacity: 0, scale: 0.5 }
                    : isHovered
                    ? { y: [0, -3, 0] }
                    : { y: 0, opacity: 1, scale: 1 }
                }
                transition={
                  isClicked
                    ? { duration: 0.4, ease: "easeIn" }
                    : isHovered
                    ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
                className="flex items-center justify-center text-ink group-hover:text-amber-400 transition-colors duration-300"
              >
                <ArrowUp className="h-5 w-5 stroke-[2.5]" />
              </motion.div>

              {/* Rocket Re-entry effect when launching */}
              {isClicked && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3, type: "spring", stiffness: 300 }}
                  className="absolute text-amber-400"
                >
                  <ArrowUp className="h-5 w-5 stroke-[2.5]" />
                </motion.div>
              )}
            </div>

            {/* Floating Sparkle Micro-detail on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-1 -right-1 z-30 text-amber-400 pointer-events-none"
                >
                  <Sparkles className="h-3.5 w-3.5 fill-amber-400/30 animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sleek Tooltip with Dynamic Progress % */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-surface/95 px-3 py-1 text-xs font-medium text-ink shadow-2xl backdrop-blur-xl flex items-center gap-1.5 z-40"
                >
                  <span>Top</span>
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  <span className="font-mono font-bold text-amber-400">{percent}%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

