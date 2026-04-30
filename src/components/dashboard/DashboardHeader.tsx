"use client";

import { HelpCircle, LogOut, Search, Settings, User } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { navItemBase } from "../settings/SettingsSidebar";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";

const userMenuNav = [
  {
    title: "Account",
    href: "/settings/account",
    icon: <User />,
  },
  {
    title: "Settings",
    href: "/settings/general",
    icon: <Settings />,
  },
  {
    title: "Help",
    href: "/help",
    icon: <HelpCircle />,
  },
];

const navItemDropdown = `${navItemBase} tracking-[0.02rem] w-full hover:!bg-sidebar-accent`;

export default function DashboardHeader() {
  const { user, signout } = useAuth();
  const { isMobile } = useSidebar();

  return (
    <motion.header
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="bg-background sticky top-0 z-50 flex h-13 items-center"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          {isMobile && <SidebarTrigger className="shrink-0" />}

          <div className="relative w-full">
            <Search
              className={cn(
                "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-[#5e5e5e]",
              )}
            />

            <Input
              placeholder="Search..."
              className="placeholder:text-muted-foreground/50 h-7 pl-10 select-none sm:w-60"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <Avatar className="h-8 w-8">
                {/* <AvatarImage src="/placeholder.svg?height=32&width=32" /> */}

                <AvatarFallback className="normal-case">
                  {user?.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="pb-0 text-base">{user?.username}</DropdownMenuLabel>

            <DropdownMenuLabel className="text-muted-foreground/70 pt-0 text-sm">
              {user?.email}
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="mx-2" />
            {userMenuNav.map((item) => (
              <DropdownMenuItem key={item.title} asChild>
                <Link href={item.href} className={cn(navItemDropdown)}>
                  {item.icon}
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="mx-2 h-[0.5px]" />

            <DropdownMenuItem className={cn(navItemDropdown)} onClick={() => signout()}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
