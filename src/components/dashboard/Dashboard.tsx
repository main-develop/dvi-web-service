"use client";

import { getItemVariants } from "@/src/utils/get-motion-variants";
import { motion } from "motion/react";

export default function Dashboard() {
  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="flex flex-col"
    >
    </motion.div>
  );
}
