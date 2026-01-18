import Image from "next/image";
import Link from "next/link";
import logoImage from "@/public/logo.png";

export const Logo = () => {
  return (
    <Link href="/">
      <Image src={logoImage} alt="DVI" width={55} className="relative"></Image>
    </Link>
  );
};
