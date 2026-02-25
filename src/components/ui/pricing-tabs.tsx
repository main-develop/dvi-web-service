"use client";

import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { Button } from "./button";

interface PricingTabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
}

export function PricingTab({ text, selected, setSelected }: PricingTabProps) {
  return (
    <Button
      onClick={() => setSelected(text)}
      effect="none"
      className={cn(
        "relative w-fit px-4 py-1.5 text-xs font-semibold",
        "bg-transparent hover:bg-transparent",
      )}
    >
      <span
        className={cn("text-primary relative z-40", selected ? "text-secondary" : "text-primary")}
      >
        {text}
      </span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: "keyframes", duration: 0.3 }}
          className="text-secondary bg-primary absolute inset-0 z-0 rounded-md shadow-sm"
        />
      )}
    </Button>
  );
}
