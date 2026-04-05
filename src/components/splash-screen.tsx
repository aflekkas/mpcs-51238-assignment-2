"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Subtle red ambient glow behind logo */}
            <motion.div
              className="absolute w-[600px] h-[300px] rounded-full bg-netflix-red/20 blur-[120px]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.6, 0.8, 0],
                scale: [0.5, 1, 1.2, 2],
              }}
              transition={{ duration: 2.8, ease: "easeInOut" }}
            />

            {/* Logo text */}
            <motion.div
              className="font-logo text-netflix-red text-6xl sm:text-8xl md:text-9xl tracking-wider select-none relative"
              style={{
                textShadow: "0 0 40px rgba(229, 9, 20, 0.6)",
              }}
              initial={{ opacity: 0, scale: 0.5, filter: "brightness(0)" }}
              animate={{
                opacity: [0, 1, 1, 1, 1],
                scale: [0.5, 1, 1, 1.05, 18],
                filter: [
                  "brightness(0)",
                  "brightness(1)",
                  "brightness(1)",
                  "brightness(1.2)",
                  "brightness(0)",
                ],
              }}
              transition={{
                duration: 2.8,
                times: [0, 0.15, 0.5, 0.75, 1],
                ease: "easeInOut",
              }}
              onAnimationComplete={() => setShow(false)}
            >
              CANTFINDAFLIX
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
