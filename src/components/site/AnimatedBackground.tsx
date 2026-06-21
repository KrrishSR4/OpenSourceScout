import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Grid size for the centered contribution matrix (7 rows, 32 columns = 224 cells)
  const contributionGridCenter = Array.from({ length: 7 * 32 });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden bg-transparent">
      {/* 1. Background Grid Paper Pattern */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bg-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--color-foreground)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid)" />
      </svg>

      {/* 2. Git Branching Network Lines (High visibility branching paths) */}
      <svg className="absolute inset-0 h-full w-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-blue-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-4)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--color-accent-2)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-accent-3)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="grad-red-magenta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-accent-3)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="grad-yellow-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-2)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-accent-4)" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Path 1: Top-Left to Bottom-Right */}
        <motion.path
          d="M -100,200 Q 300,100 700,350 T 1300,250 T 1900,550 T 2300,350"
          fill="none"
          stroke="url(#grad-blue-green)"
          strokeWidth="2"
          strokeDasharray="10 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -120 }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
          }}
        />

        {/* Path 2: Center-Left to Top-Right */}
        <motion.path
          d="M -100,500 C 400,600 800,200 1200,400 T 2300,150"
          fill="none"
          stroke="url(#grad-red-magenta)"
          strokeWidth="1.8"
          strokeDasharray="6 6"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 80 }}
          transition={{
            repeat: Infinity,
            duration: 22,
            ease: "linear",
          }}
        />

        {/* Path 3: Bottom-Left to Center-Right */}
        <motion.path
          d="M -100,850 Q 500,700 900,500 T 1700,650 T 2300,450"
          fill="none"
          stroke="url(#grad-yellow-blue)"
          strokeWidth="1.8"
          strokeDasharray="12 6"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -90 }}
          transition={{
            repeat: Infinity,
            duration: 28,
            ease: "linear",
          }}
        />

        {/* Glowing Data Pulses */}
        <motion.path
          d="M -100,200 Q 300,100 700,350 T 1300,250 T 1900,550 T 2300,350"
          fill="none"
          stroke="var(--color-accent-2)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 2500", strokeDashoffset: 0 }}
          animate={{ strokeDasharray: "120 2500", strokeDashoffset: -2500 }}
          transition={{
            repeat: Infinity,
            duration: 9,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d="M -100,500 C 400,600 800,200 1200,400 T 2300,150"
          fill="none"
          stroke="var(--color-accent-3)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 2500", strokeDashoffset: 0 }}
          animate={{ strokeDasharray: "90 2500", strokeDashoffset: -2500 }}
          transition={{
            repeat: Infinity,
            duration: 11,
            delay: 3,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* 3. Central "Scout Radar" Compass System (Behind Hero / Search Area) */}
      <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] opacity-25 flex justify-center items-center">
        <svg className="w-full h-full text-foreground/40" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Radar Grid - Outer Solid Ring */}
          <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          
          {/* Radar Grid - Middle Dashed Ring */}
          <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" strokeOpacity="0.4" />
          
          {/* Radar Grid - Inner Ticks Ring */}
          <circle cx="250" cy="250" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.3" />
          
          {/* Core Pulsing Sonar Node */}
          <motion.circle
            cx="250"
            cy="250"
            r="12"
            fill="var(--color-accent-2)"
            animate={{
              r: [12, 18, 12],
              fillOpacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Sonar Pulse Wave 1 */}
          <motion.circle
            cx="250"
            cy="250"
            r="40"
            stroke="var(--color-accent-2)"
            strokeWidth="1.5"
            initial={{ r: 20, opacity: 0.8 }}
            animate={{
              r: [20, 200],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Sonar Pulse Wave 2 */}
          <motion.circle
            cx="250"
            cy="250"
            r="40"
            stroke="var(--color-accent-4)"
            strokeWidth="1.2"
            initial={{ r: 20, opacity: 0.8 }}
            animate={{
              r: [20, 200],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 4,
              delay: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Crosshair (Horizontal & Vertical Axes) */}
          <line x1="250" y1="20" x2="250" y2="480" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.2" />
          <line x1="20" y1="250" x2="480" y2="250" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.2" />

          {/* Center Coordinates & Degree Markers */}
          <text x="260" y="90" fill="currentColor" opacity="0.4" fontSize="8" fontFamily="var(--font-mono)">LAT: 47.6062</text>
          <text x="260" y="420" fill="currentColor" opacity="0.4" fontSize="8" fontFamily="var(--font-mono)">LNG: -122.3321</text>
          <text x="50" y="245" fill="currentColor" opacity="0.3" fontSize="8" fontFamily="var(--font-mono)">SYS_SCAN_ACTIVE</text>

          {/* Rotating Target Sweeper (Radar Sweep line) */}
          <motion.g
            style={{ originX: "250px", originY: "250px" }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "linear",
            }}
          >
            {/* The sweeping gradient line */}
            <line x1="250" y1="250" x2="250" y2="30" stroke="var(--color-accent-2)" strokeWidth="2.5" strokeOpacity="0.8" />
            <polygon points="250,250 250,30 200,35" fill="url(#sweep-grad)" opacity="0.25" />
          </motion.g>

          {/* Sweeper Gradient definitions */}
          <defs>
            <radialGradient id="sweep-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent-2)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-accent-2)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Floating Commit Bubbles */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => {
          const size = Math.random() * 6 + 4;
          const left = Math.random() * 90 + 5;
          const top = Math.random() * 80 + 5;
          const delay = Math.random() * 6;
          const duration = Math.random() * 8 + 10;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full border border-border/40 bg-surface/90 opacity-40"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* 5. CENTERED GitHub Contribution Streak Graph */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 bottom-8 opacity-35 transition-opacity hover:opacity-60 flex justify-center items-center px-4 w-full overflow-hidden"
      >
        <div className="grid grid-flow-col grid-rows-7 gap-[3.5px] scale-90 sm:scale-100">
          {contributionGridCenter.map((_, i) => {
            const colors = [
              "rgba(255, 255, 255, 0.05)", 
              "rgba(138, 225, 60, 0.25)", 
              "rgba(138, 225, 60, 0.5)", 
              "rgba(138, 225, 60, 0.8)", 
              "var(--color-accent-2)"
            ];
            const randIdx = Math.floor(
              Math.random() * 2 === 0 
                ? Math.random() * 2 
                : Math.random() * colors.length
            );
            return (
              <motion.div
                key={i}
                className="h-3 w-3 rounded-[1.5px] border border-border/10"
                style={{ backgroundColor: colors[randIdx] }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: Math.random() * 5 + 4,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
