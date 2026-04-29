"use client";

import { LucideMousePointerClick, SettingsIcon, ShieldCheck, User } from "lucide-react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { motion } from "motion/react";
import AccountSettings from "./AccountSettings";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { cn } from "@/src/lib/utils";
import { useState } from "react";

type Section = "General" | "Account" | "Appearance" | "Privacy";

const sidebarNav = [
  {
    title: "General",
    icon: <SettingsIcon />,
  },
  {
    title: "Account",
    icon: <User />,
  },
  {
    title: "Appearance",
    icon: <LucideMousePointerClick />,
  },
  {
    title: "Privacy",
    icon: <ShieldCheck />,
  },
];

export const navItemBase =
  "text-primary-foreground hover:text-primary cursor-pointer text-[0.813rem] " +
  "uppercase transition-all duration-400 active:scale-[0.93]";

export const navItemSidebar =
  `${navItemBase} hover:bg-sidebar-accent/60 tracking-[0.04rem] font-medium ` +
  "!ring-0 !outline-none select-none";

export default function Settings() {
  const [activeSection, setActiveSection] = useState<Section>("General");

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row rounded-md py-4">
          <motion.div
            variants={getItemVariants(0, 0, 0.7)}
            initial="hidden"
            animate="visible"
            className="sticky top-11 flex w-70 flex-shrink-0 flex-col gap-3 self-start"
          >
            <h2 className="uppercase">Settings</h2>

            <SidebarMenu>
              <SidebarMenuItem className="flex flex-col gap-1">
                {sidebarNav.map((item) => (
                  <SidebarMenuButton
                    key={item.title}
                    onClick={() => setActiveSection(item.title as Section)}
                    className={cn(
                      navItemSidebar,
                      `${activeSection === item.title ? "bg-sidebar-accent/60 text-primary" : ""}`,
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </SidebarMenuButton>
                ))}
              </SidebarMenuItem>
            </SidebarMenu>
          </motion.div>

          {activeSection === "Account" ? (
            <AccountSettings />
          ) : (
            <motion.div
              variants={getItemVariants(0, 0, 0.7)}
              initial="hidden"
              animate="visible"
              className="flex h-[638px] w-full items-center justify-center py-[35px]"
            >
              In development...
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
