"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./ui/logo";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/about", name: "ABOUT" },
  { href: "/pricing", name: "PRICING" },
  { href: "/changelog", name: "CHANGELOG" },
  { href: "/company", name: "COMPANY" },
  { href: "/help", name: "HELP" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-50 px-7 py-3 ${
        isScrolled ? "backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <nav className="flex max-w-full mx-auto items-center">
        <div className="flex-1 flex items-center justify-start">
          <Logo />
        </div>
        <ul className="sm:flex hidden px-6 gap-7 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-primary-foreground font-semibold tracking-[0.04rem] hover:text-primary/90 text-opacity-60 hover:text-opacity-100 transition"
            >
              {link.name}
            </Link>
          ))}
        </ul>
        <div className="flex flex-1 gap-2 justify-end">
          {["SIGN IN", "SIGN UP"].map((label) => (
            <Button
              key={label}
              className="tracking-tight sm:bg-primary/90 hover:bg-primary/80 transition-all"
            >
              {label}
            </Button>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
