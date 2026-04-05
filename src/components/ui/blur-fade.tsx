"use client";

import { motion, type Variants } from "motion/react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  inView?: boolean;
  blur?: string;
}

const variants: Variants = {
  hidden: (custom: { yOffset: number; blur: string }) => ({
    y: custom.yOffset,
    opacity: 0,
    filter: `blur(${custom.blur})`,
  }),
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
};

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.4,
  yOffset = 6,
  inView = true,
  blur = "6px",
}: BlurFadeProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileInView={inView ? "visible" : undefined}
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      custom={{ yOffset, blur }}
      transition={{
        delay,
        duration,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
