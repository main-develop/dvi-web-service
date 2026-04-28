"use client";

import { LucideMousePointerClick, Settings, ShieldCheck, User } from "lucide-react";
import { Logo } from "../ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import { useState } from "react";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { cn } from "@/src/lib/utils";

type Section = "General" | "Account" | "Appearance" | "Privacy";

const sidebarNav = [
  {
    title: "General",
    icon: <Settings />,
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

export function SettingsSidebar() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [activeSection, setActiveSection] = useState<Section>("General");

  return (
    <motion.div variants={getItemVariants(0, 0, 0.7)} initial="hidden" animate="visible">
      <Sidebar collapsible="icon" className="!border-r-0">
        <SidebarHeader className="bg-background">
          <SidebarMenu>
            <SidebarMenuItem>
              {!isMobile && (
                <div
                  className={cn(
                    `flex h-8 items-center justify-between pt-1 ${isCollapsed ? "pl-0" : "pl-2"}`,
                  )}
                >
                  <div
                    className={cn(
                      "px-0 transition-opacity duration-400",
                      `${isCollapsed ? "pointer-events-none w-0 overflow-hidden opacity-0" : "opacity-100"}`,
                    )}
                  >
                    <Logo width={46} href="/dashboard" />
                  </div>
                </div>
              )}

              {isMobile && (
                <div className="flex items-center pt-1 pl-2">
                  <Logo width={46} href="/dashboard" />
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="bg-background">
          <SidebarGroup>
            <SidebarGroupContent>
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
                      tooltip={item.title}
                    >
                      {item.icon}
                      {item.title}
                    </SidebarMenuButton>
                  ))}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
      </Sidebar>
    </motion.div>
  );
}
