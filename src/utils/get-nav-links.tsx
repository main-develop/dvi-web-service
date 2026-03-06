import Link from "next/link";
import { cn } from "../lib/utils";

interface NavLinkProps {
  title: string;
  href: string;
}

export const getNavLinks = (navLinks: NavLinkProps[], className: string = "") =>
  navLinks.map((link) => (
    <Link
      key={link.title}
      href={link.href}
      className={cn(
        "text-primary-foreground hover:text-primary/90 tracking-[0.04rem] uppercase transition",
        className,
      )}
    >
      {link.title}
    </Link>
  ));
