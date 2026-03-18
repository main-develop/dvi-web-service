import Link from "next/link";

export const getTextLink = (href: string, text: string) => (
  <Link
    href={href}
    className="text-matrix-80 hover:text-matrix underline transition-all duration-300"
  >
    {text}
  </Link>
);
