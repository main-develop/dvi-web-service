import { Transition, Variants } from "motion";

export const getItemInitial = (opacity: number = 0, blur: number = 4, y: number = 15) => ({
  opacity: opacity,
  filter: `blur(${blur}px)`,
  y: y,
});

export const getItemAnimate = (opacity: number = 1, blur: number = 0, y: number = 0) => ({
  opacity: opacity,
  filter: `blur(${blur}px)`,
  y: y,
});

export const getItemTransition = (index: number = 0): Transition<undefined> | undefined => ({
  delay: 0.6 + index * 0.15,
  duration: 0.6,
  type: "spring",
  stiffness: 100,
  damping: 10,
});

export const getContainerVariants = (): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
});

export const getItemVariants = (hiddenY: number = 15): Variants => ({
  hidden: {
    opacity: 0,
    filter: "blur(4px)",
    y: hiddenY,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.6 },
  },
});
