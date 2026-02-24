"use client";

import Link from "next/link";
import { cn } from "../lib/utils";

const socials = [
  {
    title: "telegram",
    href: "https://telegram.org/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
        <path
          fill="currentColor"
          d="M41.4193 7.30899C41.4193 7.30899 45.3046 5.79399 44.9808 9.47328C44.8729 10.9883 43.9016 16.2908 43.1461 22.0262L40.5559 39.0159C40.5559 39.0159 40.3401 41.5048 38.3974 41.9377C36.4547 42.3705 33.5408 40.4227 33.0011 39.9898C32.5694 39.6652 24.9068 34.7955 22.2086 32.4148C21.4531 31.7655 20.5897 30.4669 22.3165 28.9519L33.6487 18.1305C34.9438 16.8319 36.2389 13.8019 30.8426 17.4812L15.7331 27.7616C15.7331 27.7616 14.0063 28.8437 10.7686 27.8698L3.75342 25.7055C3.75342 25.7055 1.16321 24.0823 5.58815 22.459C16.3807 17.3729 29.6555 12.1786 41.4193 7.30899Z"
        />
      </svg>
    ),
  },
  {
    title: "github",
    href: "https://github.com/main-develop",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
        <path
          fill="currentColor"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59c.4.07.55-.17.55-.38c0-.19-.01-.82-.01-1.49c-2.01.37-2.53-.49-2.69-.94c-.09-.23-.48-.94-.82-1.13c-.28-.15-.68-.52-.01-.53c.63-.01 1.08.58 1.23.82c.72 1.21 1.87.87 2.33.66c.07-.52.28-.87.51-1.07c-1.78-.2-3.64-.89-3.64-3.95c0-.87.31-1.59.82-2.15c-.08-.2-.36-1.02.08-2.12c0 0 .67-.21 2.2.82c.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82c.44 1.1.16 1.92.08 2.12c.51.56.82 1.27.82 2.15c0 3.07-1.87 3.75-3.65 3.95c.29.25.54.73.54 1.48c0 1.07-.01 1.93-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
        />
      </svg>
    ),
  },
  {
    title: "youtube",
    href: "https://www.youtube.com/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
        <path
          fill="currentColor"
          d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104l.022.26l.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105l-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006l-.087-.004l-.171-.007l-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103l.003-.052l.008-.104l.022-.26l.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007l.172-.006l.086-.003l.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"
        />
      </svg>
    ),
  },
];

const navLinks = [
  {href: "/contact", title: "Contact"},
  {href: "/privacy-policy", title: "Privacy Policy"},
  {href: "/careers", title: "Careers"},
];

const getNavLinks = (style: string = "") => 
  navLinks.map((link) => (
    <Link
      key={link.title}
      href={link.href}
      className={cn(
        "text-primary-foreground hover:text-primary/90 tracking-[0.04rem] uppercase transition",
        style,
      )}
    >
      {link.title}
    </Link>
  ))

export default function Footer() {
  return (
    <footer
      className="mt-auto mb-4 px-7 py-3"
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-0">
        <ul className="flex flex-row items-center gap-5 sm:gap-3">
          {socials.map(({ title, href, icon }) => (
            <li key={title}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground hover:text-primary/90 transition"
              >
                {icon}
              </a>
            </li>
          ))}
        </ul>

        <ul className="order-first flex flex-row gap-5 sm:order-none">
          {getNavLinks("text-[0.813rem] cursor-pointer")}
        </ul>

        <p className="text-primary-foreground text-center text-[0.813rem]">&copy; 2026 DVI</p>
      </div>
    </footer>
  );
}
