"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { MatrixText } from "../ui/matrix-text";
import MockupTabs from "../ui/mockup-tabs";
import { cn } from "@/src/lib/utils";
import * as motions from "@/src/utils/get-motion-variants";
import { useRouter } from "next/navigation";

const heroButtons = [
  { href: "/sign-up", title: "Get started" },
  { href: "/showcase", title: "View showcase" },
];

export default function HeroSection() {
  const containerVariants = motions.getContainerVariants();
  const itemVariants = motions.getItemVariants();
  const router = useRouter();

  return (
    <div className="flex flex-col px-5 md:px-10 lg:flex-row lg:pr-0 lg:pl-22">
      <motion.div
        className="flex h-auto flex-col justify-center pt-40 md:pt-32 lg:h-screen lg:w-fit lg:pt-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="text-center text-3xl font-semibold md:text-4xl lg:text-start lg:text-5xl"
          variants={itemVariants}
        >
          <h1 className="pb-[1.10] leading-[1.10] lg:leading-none">
            VISUALIZE WITH <span className="matrix-text">CONFIDENCE</span>:
          </h1>
          <MatrixText
            phrases={["SECURE DATA HANDLING", "AFFORDABLE VISUALS", "PRIVACY-FIRST ANALYTICS"]}
          />
        </motion.div>
        <motion.p
          className="mx-auto max-w-xl px-6 pt-5 text-center md:max-w-2xl md:px-0 md:text-base lg:mx-0 lg:text-start"
          variants={itemVariants}
        >
          Build, share, and analyze visualizations without the risks — engineered with your
          data&apos;s safety <br className="hidden lg:inline" /> in mind, DVI makes analytics
          infrastructure accessible to everyone.
        </motion.p>
        <div className="flex justify-center gap-4 pt-5 lg:justify-start">
          {heroButtons.map(({ href, title }, index) => (
            <motion.div
              className="backdrop-blur-xs"
              key={title}
              initial={motions.getItemInitial()}
              animate={motions.getItemAnimate()}
              transition={motions.getItemTransition(index)}
            >
              <Button
                onClick={() => router.push(href)}
                className={cn(
                  "matrix-box-shadow bg-matrix/10 hover:bg-matrix/15",
                  "border-matrix text-primary border-1 transition-all duration-400",
                )}
              >
                {title}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="mt-16 flex flex-1 items-start justify-center md:mt-12 lg:mt-0 lg:items-center"
        initial={motions.getItemInitial()}
        animate={motions.getItemAnimate()}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <MockupTabs />
      </motion.div>
    </div>
  );
}
