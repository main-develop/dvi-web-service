"use client";

import { Card, CardContent } from "./card";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface TabConfig {
  label: string;
  image: string;
  width?: string;
}

interface MockupTabsProps {
  tabs?: TabConfig[];
}

const defaultTabs: TabConfig[] = [
  {
    label: "Desktop",
    image: "/desktop-mockup.png",
    width: "w-full max-w-[360px] md:max-w-[480px] lg:max-w-[640px]",
  },
  {
    label: "Mobile",
    image: "/mobile-mockup.png",
    width: "w-full max-w-[210px] md:max-w-[300px] lg:max-w-[400px]",
  },
];

export default function MockupTabs({ tabs = defaultTabs }: MockupTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const firstElement = tabRefs.current[0];
      if (firstElement) {
        const { offsetLeft, offsetWidth } = firstElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="relative flex h-[200px] w-full items-end justify-center select-none md:h-[320px] lg:h-[420px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={tabs[activeIndex].image}
            alt={`${tabs[activeIndex].label} mockup`}
            className={`absolute bottom-0 object-contain ${tabs[activeIndex].width ?? ""}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 0.9],
            }}
          />
        </AnimatePresence>
      </div>
      {/* Tabs */}
      <Card className="relative flex items-center justify-center border-none bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="relative">
            {/* Active indicator */}
            <motion.div
              className="bg-matrix absolute bottom-[-0px] h-[2px] transition-all duration-400 ease-out"
              style={activeStyle}
            />
            {/* Tab buttons */}
            <div className="relative flex items-center space-x-[6px]">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  className={cn(
                    "text-primary-foreground hover:text-primary h-[30px] cursor-pointer px-3 py-2",
                    "transition-colors duration-300",
                    { "text-primary": index === activeIndex },
                  )}
                  onClick={() => setActiveIndex(index)}
                >
                  <div
                    className={cn(
                      "flex text-[0.813rem] whitespace-nowrap uppercase select-none",
                      "h-full items-center justify-center",
                    )}
                  >
                    {tab.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
