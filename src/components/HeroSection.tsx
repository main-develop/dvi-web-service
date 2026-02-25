"use client";

import { motion } from "motion/react";
import { Button } from "./ui/button";
import { MatrixText } from "./ui/matrix-text";
import MockupTabs from "./ui/mockup-tabs";
import { cn } from "../lib/utils";
import * as motions from "../utils/motion-variants";

export default function HeroSection() {
  const containerVariants = motions.getContainerVariants();
  const itemVariants = motions.getItemVariants();

  return (
    <div className="flex flex-col px-5 sm:flex-row sm:pr-0 sm:pl-22">
      <motion.div
        className="flex h-auto flex-col justify-center pt-40 sm:h-screen sm:w-fit sm:pt-0"
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
              initial={motions.getItemInitial()}
              animate={motions.getItemAnimate()}
              transition={motions.getItemTransition(index)}
            >
              <Button
                className={cn(
                  "matrix-box-shadow bg-matrix/10 hover:bg-matrix/15",
                  "border-matrix text-primary border-1",
                )}
              >
                {label}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="flex flex-1 items-center justify-center pt-50 sm:pt-0"
        initial={motions.getItemInitial()}
        animate={motions.getItemAnimate()}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <MockupTabs />
      </motion.div>
    </div>
  );
}
