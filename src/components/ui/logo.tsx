import Image from "next/image";
import Link from "next/link";
import logoImage from "@/public/logo.png";

export const Logo = ({ width = 55 }: { width: number }) => {
  return (
    <Link href="/">
      <Image src={logoImage} alt="logo" width={width} className="relative select-none" />
    </Link>
  );
};
