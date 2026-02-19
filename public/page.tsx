"use client";

import { CharParticlesBackground } from "../components/CharParticlesBackground";
import { OverviewSection } from "../components/OverviewSection";
import { Button } from "../components/ui/button";
import { MatrixText } from "../components/ui/matrix-text";
import MockupTabs from "../components/ui/mockup-tabs";
import { motion, Variants } from "motion/react";

const defaultItemVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)", y: 15 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

export default function Home() {
  return (
    <>
      <CharParticlesBackground
        className="absolute inset-0 z-[-1]"
        quantity={130}
        staticity={40}
        ease={40}
        size={0.4}
        color="#00ff00"
      />
      <div className="flex sm:flex-row flex-col sm:pl-22 sm:pr-0 px-5 pb-0">
        <div className="flex flex-col sm:w-fit h-screen justify-center">
          <motion.div
            className="sm:text-5xl text-3xl sm:text-start text-center font-semibold"
            initial="hidden"
            animate="visible"
            variants={defaultItemVariants}
            transition={{ delay: 0.2, duration: 0.6 }}
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
            initial="hidden"
            animate="visible"
            variants={defaultItemVariants}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Build, share, and analyze visualizations without the risks —
            engineered with your data&apos;s safety <br /> in mind, DVI makes
            analytics infrastructure accessible to everyone.
          </motion.p>
          <div className="flex pt-5 gap-4 sm:justify-start justify-center">
            {["Get Started", "View Showcase"].map((label, index) => (
              <motion.div
                className="backdrop-blur-xs"
                key={label}
                initial="hidden"
                animate="visible"
                variants={defaultItemVariants}
                transition={{
                  delay: 0.6 + index * 0.15,
                  duration: 0.7,
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                }}
              >
                <Button className="uppercase matrix-box-shadow bg-[#00ff00]/10 hover:bg-[#00ff00]/15 transition-all border-1 border-[#00ff00] text-primary">
                  {label}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          className="flex flex-1 items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={defaultItemVariants}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <MockupTabs></MockupTabs>
        </motion.div>
      </div>
      <div>
        <OverviewSection />
      </div>
      {/* Transform your raw data into beautiful, interactive insights. Discover patterns and tell compelling stories with your numbers. */}
    </>
  );
}
