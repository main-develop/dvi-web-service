"use client";

import { getItemVariants } from "@/src/utils/get-motion-variants";
import { motion } from "motion/react";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Settings() {
  const { isMobile } = useSidebar();

  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="flex flex-col px-6"
    >
      <header className="flex h-13 items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <h2 className="text-xl uppercase">General</h2>
          <div className="flex w-full items-center gap-4 sm:w-auto">
            {isMobile && <SidebarTrigger className="shrink-0" />}
            <div className="relative w-full">
              <Search
                className={cn(
                  "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-[#5e5e5e]",
                )}
              />
              <Input
                placeholder="Search settings..."
                className="placeholder:text-muted-foreground/50 h-7 border-1 pl-10 select-none sm:w-60"
              />
            </div>
          </div>
        </div>
      </header>
    </motion.div>
  );
}
