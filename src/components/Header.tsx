import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./ui/logo";

export default function Header() {
  const navLinks = [
    { href: "/about", name: "ABOUT" },
    { href: "/pricing", name: "PRICING" },
    { href: "/changelog", name: "CHANGELOG" },
    { href: "/company", name: "COMPANY" },
    { href: "/help", name: "HELP" },
  ];

  return (
    <header className="sticky backdrop-blur-sm shadow-md select-none top-0 z-50 px-7 py-3">
      <nav className="flex max-w-full mx-auto items-center">
        <div className="flex-1 flex items-center justify-start">
          <Logo></Logo>
        </div>
        <ul className="sm:flex hidden px-6 gap-7 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-primary-foreground font-semibold tracking-[0.04rem] hover:text-[#fafafa] text-opacity-60 hover:text-opacity-100 transition"
            >
              {link.name}
            </Link>
          ))}
        </ul>
        <div className="flex flex-1 gap-2 justify-end">
          <Button className="uppercase tracking-tight">Sign In</Button>
          <Button className="uppercase tracking-tight">Sign Up</Button>
        </div>
      </nav>
    </header>
  );
}
