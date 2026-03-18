"use client";

import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { createPortal } from "react-dom";
import { getNavLinks } from "@/src/utils/get-nav-links";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const navLinks = [
  { href: "/about", title: "ABOUT" },
  { href: "/pricing", title: "PRICING" },
  { href: "/changelog", title: "CHANGELOG" },
  { href: "/company", title: "COMPANY" },
  { href: "/help", title: "HELP" },
];

const getSignButtons = (router: AppRouterInstance, className: string = "") =>
  ["sign-in", "sign-up"].map((href) => (
    <Button
      key={href}
      onClick={() => router.push(href)}
      className={`${className} tracking-tight transition-all duration-400`}
    >
      {href.replace("-", " ")}
    </Button>
  ));

const svgPathStyle = [
  cn(
    "group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]",
    "-translate-y-[7px] [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)]",
  ),
  "[transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45",
  cn(
    "group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]",
    "translate-y-[7px] [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)]",
  ),
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflowY = "hidden";

      return () => {
        document.body.style.overflowY = "auto";
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      className={cn("sticky top-0 z-50 bg-transparent px-7 py-3", {
        "shadow-md backdrop-blur-sm": isScrolled || isMobileMenuOpen,
      })}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <nav className="mx-auto flex max-w-full items-center">
        <div className="flex h-[34px] items-center justify-start">
          <Logo />
        </div>
        {isHome && (
          <>
            <div className="hidden flex-1 md:flex">
              <ul className="flex flex-1 items-center justify-center gap-7 px-6">
                {getNavLinks(navLinks, "text-sm font-semibold")}
              </ul>
              <div className="flex justify-end gap-2">{getSignButtons(router)}</div>
            </div>
            <div className="flex flex-1 items-center justify-end md:hidden">
              <Button
                className="group scale-170"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen((prevState) => !prevState)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {svgPathStyle.map((style, index) => (
                    <path
                      key={`path-${index}`}
                      d="M4 12L20 12"
                      className={`origin-center transition-all duration-300 ${style}`}
                    />
                  ))}
                </svg>
              </Button>
            </div>
          </>
        )}
      </nav>
      {typeof window === "undefined"
        ? null
        : createPortal(
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  key="mobile-menu"
                  id="mobile-menu"
                  className={cn(
                    "bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
                    "fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden px-7 py-5 md:hidden",
                  )}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ul className="flex flex-col items-start gap-y-4">
                    {getNavLinks(navLinks, "text-lg font-semibold")}
                  </ul>
                  <div className="flex flex-col gap-2 pt-8">{getSignButtons(router, "h-10")}</div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )}
    </motion.header>
  );
}
