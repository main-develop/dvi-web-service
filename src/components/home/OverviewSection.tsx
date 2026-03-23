"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { BackgroundGridPattern } from "../ui/background-grid-pattern";
import { cn } from "@/src/lib/utils";
import { getItemAnimate, getItemInitial } from "@/src/utils/get-motion-variants";

const content = [
  {
    title: "VARIOUS CHARTS SUPPORT",
    description: `Unlock deeper understanding with a rich selection of chart types: 
      funnel breakdowns, donut/pie distributions, layered area graphs, time-series 
      comparisons, and more. Our flexible visualizations help you spot patterns, 
      track progress, and communicate insights clearly.`,
    image: "/charts.png",
  },
  {
    title: "HIGHLY CUSTOMIZABLE VISUALIZATIONS",
    description: `Full control at your fingertips. Rearrange widgets, resize charts, 
      customize colors, legends, labels, and summaries seamlessly. Create custom 
      templates to easily apply the visualizations you need. Make your dashboard 
      exactly how you want it.`,
    image: "/blocks.png",
  },
  {
    title: "INTUITIVE INTERFACE",
    description: `A thoughtfully designed file hub that feels instantly familiar. 
      Fast uploads, instant search, one-click sorting, bulk selection, and per-file 
      actions — all in a clean workspace. Forget about bloated dashboards.`,
    image: "/datasets-table.png",
  },
  {
    title: "STAY INFORMED ABOUT YOUR WORKSPACE",
    description: `A dedicated monitoring hub delivers real-time updates for system 
      resources, so you always know what's happening. Receive instant notifications to 
      keep yourself aligned, spot issues, and control resources.`,
    image: "/notifs.png",
  },
];

export const OverviewSection = ({
  backgroundGridSquares,
}: {
  backgroundGridSquares: number[][];
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Track page scroll relative to this component's position
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
        return index;
      }
      return acc;
    }, 0);
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <div
      ref={ref}
      className="relative flex-col lg:flex-row"
      style={{ height: `calc(40rem * ${cardLength})` }}
    >
      <motion.div
        className={cn(
          "sticky top-0 flex h-screen flex-col gap-6 rounded-md",
          "px-5 md:gap-8 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-22",
        )}
      >
        <div className="fade-top-mask absolute inset-0 size-full">
          <BackgroundGridPattern squares={backgroundGridSquares} />
        </div>

        <div
          className={cn(
            "relative flex h-[45%] w-full items-end",
            "pb-4 md:h-[40%] lg:h-full lg:flex-1 lg:items-center lg:pb-0",
          )}
        >
          {content.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              animate={{
                opacity: activeCard === index ? 1 : 0,
                display: activeCard === index ? "flex" : "none",
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "absolute inset-x-0 bottom-0 flex flex-col",
                "justify-end text-start lg:inset-0 lg:justify-center",
              )}
            >
              <h2 className="matrix-text text-2xl font-bold tracking-[0.04rem] md:text-3xl lg:text-4xl">
                {item.title}
              </h2>

              <p className="mt-3 text-base md:mt-4">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div
          className={cn(
            "flex h-[55%] w-full shrink-0 items-start justify-center",
            "overflow-hidden select-none md:h-[60%] lg:h-auto lg:w-auto lg:items-center",
          )}
        >
          <motion.img
            key={activeCard}
            src={content[activeCard].image}
            className={cn(
              "max-h-full w-full max-w-[370px] object-contain",
              "md:max-w-[500px] lg:max-h-none lg:w-[750px] lg:max-w-none lg:object-cover",
            )}
            alt="linear board demo"
            initial={getItemInitial(0, 6, 30)}
            animate={getItemAnimate()}
            exit={{ opacity: 0, filter: "blur(4px)", y: -15 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
