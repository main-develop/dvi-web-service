"use client";

import { LucideMousePointerClick, SettingsIcon, ShieldCheck, User } from "lucide-react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { motion } from "motion/react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const navItemBase =
  "text-primary-foreground hover:text-primary cursor-pointer text-[0.813rem] " +
  "uppercase transition-all duration-400 active:scale-[0.93]";

export const navItemSidebar =
  `${navItemBase} hover:bg-sidebar-accent/60 tracking-[0.04rem] font-medium ` +
  "!ring-0 !outline-none select-none";

export const settingsSidebarNav = [
  {
    title: "General",
    href: "/settings/general",
    icon: <SettingsIcon />,
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: <User />,
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: <LucideMousePointerClick />,
  },
  {
    title: "Privacy",
    href: "/settings/privacy",
    icon: <ShieldCheck />,
  },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="sticky top-11 hidden flex-shrink-0 flex-col gap-3 self-start sm:flex sm:w-70"
    >
      <h2 className="uppercase">Settings</h2>

      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col gap-1">
          {settingsSidebarNav.map((item) => (
            <SidebarMenuButton
              key={item.title}
              className={cn(
                navItemSidebar,
                pathname === item.href ? "bg-sidebar-accent/60 text-primary" : "",
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </SidebarMenuButton>
          ))}
        </SidebarMenuItem>
      </SidebarMenu>
    </motion.div>
  );
}
