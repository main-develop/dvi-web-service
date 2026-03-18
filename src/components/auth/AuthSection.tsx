import { getItemVariants } from "@/src/utils/get-motion-variants";
import { getTextLink } from "@/src/utils/get-text-link";
import { motion } from "motion/react";

interface AuthSectionProps {
  sectionHeader: string;
  sectionFooter?: { text: string; href: string; linkText: string };
  children?: React.ReactNode;
}

export default function AuthSection({ sectionHeader, sectionFooter, children }: AuthSectionProps) {
  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <h2 className="matrix-text text-center text-3xl font-bold uppercase">{sectionHeader}</h2>

      {children}

      {sectionFooter && (
        <p className="text-muted-foreground text-center text-sm">
          {sectionFooter.text} {getTextLink(sectionFooter.href, sectionFooter.linkText)}
        </p>
      )}
    </motion.div>
  );
}
