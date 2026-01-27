"use client";

import { motion, Variants } from "motion/react";
import { Button } from "./ui/button";
import { MatrixText } from "./ui/matrix-text";
import MockupTabs from "./ui/mockup-tabs";

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
    <div className="flex sm:flex-row flex-col sm:pl-22 sm:pr-0 px-5">
      <motion.div
        className="flex flex-col sm:w-fit h-screen justify-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="sm:text-5xl text-3xl sm:text-start text-center font-semibold"
          variants={itemVariants}
        >
          <h1 className="sm:leading-none leading-[1.10] pb-[1.10]">
            VISUALIZE WITH <span className="matrix-text">CONFIDENCE</span>:
          </h1>
          <MatrixText
            phrases={[
              "SECURE DATA HANDLING",
              "AFFORDABLE VISUALS",
              "PRIVACY-FIRST ANALYTICS",
            ]}
          ></MatrixText>
        </motion.div>
        <motion.p
          className="pt-5 sm:px-0 px-6 sm:text-start text-center"
          variants={itemVariants}
        >
          Build, share, and analyze visualizations without the risks —
          engineered with your data's safety <br /> in mind, DVI makes analytics
          infrastructure accessible to everyone.
        </motion.p>
        <div className="flex pt-5 gap-4 sm:justify-start justify-center">
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
              <Button className="uppercase matrix-box-shadow bg-matrix/10 hover:bg-matrix/15 transition-all border-1 border-matrix text-primary">
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
