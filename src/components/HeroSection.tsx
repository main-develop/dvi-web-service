"use client";

import { motion, Variants } from "motion/react";
import { Button } from "./ui/button";
import { MatrixText } from "./ui/matrix-text";
import MockupTabs from "./ui/mockup-tabs";
import { cn } from "../lib/utils";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)", y: 15 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function HeroSection() {
  return (
    <div className="flex flex-col px-5 sm:flex-row sm:pr-0 sm:pl-22">
      <motion.div
        className="flex h-screen flex-col justify-center sm:w-fit"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="text-center text-3xl font-semibold sm:text-start sm:text-5xl"
          variants={itemVariants}
        >
          <h1 className="pb-[1.10] leading-[1.10] sm:leading-none">
            VISUALIZE WITH <span className="matrix-text">CONFIDENCE</span>:
          </h1>
          <MatrixText
            phrases={["SECURE DATA HANDLING", "AFFORDABLE VISUALS", "PRIVACY-FIRST ANALYTICS"]}
          />
        </motion.div>
        <motion.p className="px-6 pt-5 text-center sm:px-0 sm:text-start" variants={itemVariants}>
          Build, share, and analyze visualizations without the risks — engineered with your
          data&apos;s safety <br /> in mind, DVI makes analytics infrastructure accessible to
          everyone.
        </motion.p>
        <div className="flex justify-center gap-4 pt-5 sm:justify-start">
          {["Get Started", "View Showcase"].map((label, index) => (
            <motion.div
              className="backdrop-blur-xs"
              key={label}
              initial={{ opacity: 0, filter: "blur(4px)", y: 15 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                delay: 0.6 + index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
            >
              <Button
                className={cn(
                  "matrix-box-shadow bg-matrix/10 hover:bg-matrix/15 border-matrix text-primary",
                  "cursor-pointer border-1 uppercase transition-all",
                )}
              >
                {label}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="flex flex-1 items-center justify-center"
        initial={{ opacity: 0, filter: "blur(4px)", y: 15 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <MockupTabs />
      </motion.div>
    </div>
  );
}
